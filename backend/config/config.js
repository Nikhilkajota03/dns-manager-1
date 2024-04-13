import dotenv from "dotenv";

dotenv.config({ path: ".env" });





// AWS SDK
const awsKey = {
  accessKeyId: "AKIAQT2PZ2X2G3CMPHNP",
  secretAccessKey: "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",
  HostedZoneId: "Z05457762EU2V64E5HHCE",
  defaultTTL: 3600,
};

// DB connection
const mongoDB = {
  mongoURI: "mongodb://localhost:27017",
  dbName: "dns_managment",
};

// server port and mode
const server = {
  serverPort: 5000,
  serverMode: "development",
};

// Exporting the variables
export const { accessKeyId, secretAccessKey, HostedZoneId, defaultTTL } =
  awsKey;
export const { mongoURI, dbName } = mongoDB;
export const { serverMode, serverPort } = server;
