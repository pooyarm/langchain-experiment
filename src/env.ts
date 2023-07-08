import * as dotenv from "dotenv";

dotenv.config();

if (!process.env.OPENAI_API_KEY) { throw new Error("OPENAI_API_KEY is not set"); }
if (!process.env.COLLECTION_NAME) { throw new Error("COLLECTION_NAME is not set"); }
if (!process.env.SAMPLE_DIR) { throw new Error("SAMPLE_DIR is not set"); }

export const collectionName = process.env.COLLECTION_NAME;
export const openAIApiKey = process.env.OPENAI_API_KEY;
export const sampleDir = process.env.SAMPLE_DIR;
