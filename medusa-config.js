const dotenv = require("dotenv");

let ENV_FILE_NAME = "";
switch (process.env.NODE_ENV) {
  case "production":
    ENV_FILE_NAME = ".env.production";
    break;
  case "staging":
    ENV_FILE_NAME = ".env.staging";
    break;
  case "test":
    ENV_FILE_NAME = ".env.test";
    break;
  case "development":
  default:
    ENV_FILE_NAME = ".env";
    break;
}

try {
  dotenv.config({ path: process.cwd() + "/" + ENV_FILE_NAME });
} catch (e) {}

// CORS when consuming Medusa from admin
const ADMIN_CORS =
  process.env.ADMIN_CORS || "http://localhost:7000,http://localhost:7001,/http:\/\/*/";

// CORS to avoid issues when consuming Medusa from a client
const STORE_CORS = process.env.STORE_CORS || "https://demo.01ninjas.com,/http:\/\/*/";

const DATABASE_URL =
  process.env.DATABASE_URL || "postgres://postgres:your_password@localhost:5432/medusa-store";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

const plugins = [
  `medusa-fulfillment-manual`,
  `medusa-payment-manual`,
  {
    resolve: `@medusajs/file-local`,
    options: {
      upload_dir: "uploads",
    },
  },
  // To enable the admin plugin, uncomment the following lines and run `yarn add @medusajs/admin`
  {
    resolve: "@medusajs/admin",
    /** @type {import('@medusajs/admin').PluginOptions} */
    options: {
      autoRebuild: true,
    },
  },
  {
    resolve: `medusa-file-s3`,
    options: {
        s3_url: process.env.S3_URL || "https://medusa-server-ninjas.s3.us-east-1.amazonaws.com",
        bucket: process.env.S3_BUCKET || "medusa-server-ninjas",
 
          region: process.env.S3_REGION || "us-east-1",
          access_key_id: process.env.S3_ACCESS_KEY_ID || "AKIA6N2YKPVYXFN4RNSF",
          secret_access_key: process.env.S3_SECRET_ACCESS_KEY || "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",
 
    },
  },
  {
    resolve: "medusa-plugin-algolia",
    options: {
      applicationId: "ADLGOXWA26",
      adminApiKey: "957b8947b95e58f1dba5c7f107c7338c",
      settings: {
        products: {
          indexSettings: {
            searchableAttributes: ["title", "description"],
            attributesToRetrieve: [
         
              "title",
              "description",
              "handle",
              "thumbnail",
              "images",
             "objectID",
              "tags"
            ],
          },

          transformer: (product) => ({
            
              objectID: product.id,
              description: product.description,
              title: product.title,
              handle: product.handle,
              thumbnail: product.thumbnail,
          
              tags: product.tags,
              images: product.images
            }),
          
        },
      },
    },
  },
  
 
];

const modules = {
  eventBus: {
    resolve: "@medusajs/event-bus-redis",
    options: {
      redisUrl: REDIS_URL
    }
  },
  cacheService: {
    resolve: "@medusajs/cache-redis",
    options: {
      redisUrl: REDIS_URL
    }
  },
};

/** @type {import('@medusajs/medusa').ConfigModule["projectConfig"]} */
const projectConfig = {
  jwtSecret: process.env.JWT_SECRET,
  cookieSecret: process.env.COOKIE_SECRET,
  store_cors: STORE_CORS,
  database_url: DATABASE_URL,
  admin_cors: ADMIN_CORS,
  // Uncomment the following lines to enable REDIS
   redis_url: REDIS_URL
};

/** @type {import('@medusajs/medusa').ConfigModule} */
module.exports = {
  projectConfig,
  plugins,
  modules,
};
