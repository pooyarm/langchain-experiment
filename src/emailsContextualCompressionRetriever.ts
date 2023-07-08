import { OpenAI } from "langchain/llms/openai";
import { Chroma } from "langchain/vectorstores/chroma";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { SelfQueryRetriever } from "langchain/retrievers/self_query";
import { ChromaTranslator } from "langchain/retrievers/self_query/chroma";
import { AttributeInfo } from "langchain/schema/query_constructor";
import { LLMChainExtractor } from "langchain/retrievers/document_compressors/chain_extract";
import { ContextualCompressionRetriever } from "langchain/retrievers/contextual_compression";
import { RetrievalQAChain } from "langchain/chains";

import { collectionName , openAIApiKey } from "./env.ts";

const embeddings = new OpenAIEmbeddings();
const vectorStore = await Chroma.fromExistingCollection(embeddings, { collectionName });

const model = new OpenAI({
  // modelName: "gpt-3.5-turbo",
  openAIApiKey,
  temperature: 0.9,
});
const baseCompressor = LLMChainExtractor.fromLLM(model);

const attributeInfo: AttributeInfo[] = [
  {
    name: "date",
    description: "The date and time I've received the email.",
    type: "date time",
  },
  {
    name: "from",
    description: "The contact the email is sent from to me.",
    type: "string",
  },
];

const selfQueryRetriever = await SelfQueryRetriever.fromLLM({
  llm: model,
  vectorStore,
  documentContents: 'All emails I\'ve received in my inbox.',
  attributeInfo,
  structuredQueryTranslator: new ChromaTranslator(),
});

const retriever = new ContextualCompressionRetriever({
  baseCompressor,
  baseRetriever: selfQueryRetriever,
});

const chain = RetrievalQAChain.fromLLM(model, retriever);

const query = process.argv[2];

const result = await chain.call({ query });

console.log(result);
