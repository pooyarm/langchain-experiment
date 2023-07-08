import { ChromaClient, OpenAIEmbeddingFunction } from "chromadb";

import { collectionName , openAIApiKey } from "./env.ts";
import { parseEmails } from "./parseEmails.ts";

const client = new ChromaClient();
const collection = await (async () => {
  console.log('Getting the collection...');
  const embedder = new OpenAIEmbeddingFunction({ openai_api_key: openAIApiKey });
  const params = { name: collectionName, embeddingFunction: embedder };

  try {
    const collection = await client.getCollection(params);

    console.log('Collection exists :)');
    return collection;
  } catch (e) {
    console.log('Collection does not exist :(');

    return client.createCollection(params);
  }
})();

const count = await collection.count();

console.log(`Collection has ${count} documents`);

const chunk = process.argv.indexOf('--chunk') > -1 ? process.argv[process.argv.indexOf('--chunk') + 1] : undefined;

if (count === 0 || chunk) {
  const data = await parseEmails();
  const [start, end] = (() => {
    if (!chunk) { return [0, embedderLimit]; }

    const [chunkStart, chunkEnd] = chunk.split('-').map((n) => parseInt(n, 10));

    return [chunkStart, chunkEnd];
  })();
  const partialData = data.slice(start, end).filter((email) => !!email.subject);

  console.log(`Adding documents from ${start} to ${end} to the collection...`);

  const addResult = await collection.add({
    ids: partialData.map((email) => email.id),
    metadatas: partialData.map((email) => ({
      date: email.date,
      from: email.from.text.trim(),
    })),
    documents: partialData.map((email) => email.subject.trim()),
  });

  console.log('Adding documents is done', addResult);
}

const query = process.argv[2];

if (!query) { throw new Error('query is not set'); }

console.log(`Querying for "${query}"...`);

const results = await collection.query({
  nResults: 10,
  queryTexts: [query]
});

console.log(`Found ${results.documents[0].length} results:`);

console.log(results);

console.log(results.documents[0].map((document, index) => ({
  content: document,
  metadata: results.metadatas[0][index],
  distances: results.distances?.[0][index],
})));
