import { OpenAI } from "langchain/llms/openai";
import { Chroma } from "langchain/vectorstores/chroma";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { SelfQueryRetriever } from "langchain/retrievers/self_query";
import { ChromaTranslator } from "langchain/retrievers/self_query/chroma";
import { AttributeInfo } from "langchain/schema/query_constructor";

import { collectionName , openAIApiKey } from "./env.ts";

const embeddings = new OpenAIEmbeddings();
const vectorStore = await Chroma.fromExistingCollection(embeddings, { collectionName });

const model = new OpenAI({
  // modelName: "gpt-3.5-turbo",
  openAIApiKey,
  temperature: 0.9,
});

const attributeInfo: AttributeInfo[] = [
  {
    name: "date",
    description: "The date and time the email is received.",
    type: "date time",
  },
  {
    name: "from",
    description: "The contact the email is sent from.",
    type: "string",
  },
];

const selfQueryRetriever = await SelfQueryRetriever.fromLLM({
  llm: model,
  vectorStore,
  documentContents: 'Promotion emails I\'ve received',
  attributeInfo,
  structuredQueryTranslator: new ChromaTranslator(),
});

const query = process.argv[2];

const result = await selfQueryRetriever.getRelevantDocuments(query);

console.log(result);
