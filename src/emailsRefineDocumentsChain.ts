import { loadQARefineChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { Chroma } from "langchain/vectorstores/chroma";

import { collectionName , openAIApiKey } from "./env.ts";

const embeddings = new OpenAIEmbeddings();
const vectorStore = await Chroma.fromExistingCollection(embeddings, { collectionName });

const model = new OpenAI({
  // modelName: "gpt-3.5-turbo",
  openAIApiKey,
  temperature: 0.9,
});

const chain = loadQARefineChain(model);
const query = process.argv[2];
const relevantDocs = await vectorStore.similaritySearch(query);

const res = await chain.call({
  input_documents: relevantDocs,
  question: query,
});

console.log(res);
