import { OpenAI } from "langchain/llms/openai";
import { Document } from "langchain/document";
import { loadQAStuffChain } from "langchain/chains";

import { openAIApiKey } from "./env.ts";

const model = new OpenAI({
  modelName: "gpt-3.5-turbo",
  openAIApiKey,
  temperature: 0.9,
});

const docs = [
  new Document({
    pageContent: `
      My name is Pooya, I am the most successful person in the world! don't believe me just watch!
    `
  }),
  new Document({
    pageContent: `
      Based on the latest fox news, Pooya is the most successful person in the world!
    `
  })
];

const chainA = loadQAStuffChain(model);
const resA = await chainA.call({
  input_documents: docs,
  question: "who is the most successful person?",
});
console.log({ resA });
