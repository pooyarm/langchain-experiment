# langchain-experiment

## Setup
- `npm install`
- `cp .env.example .env`
- set the values in `.env`.
- Copy your eml files into sample dir. (default: `sample/emails`)
- [Install and run chroma](https://docs.trychroma.com/getting-started#:~:text=To%20connect%20to%20Chroma%27s%20backend%20%2D%20you%20either%20need%20to%20connect%20to%20a%20hosted%20version%20of%20Chroma%2C%20or%20run%20it%20on%20your%20local%20computer.%20If%20you%20can%20run%20docker%2Dcompose%20up%20%2Dd%20%2D%2Dbuild%20you%20can%20run%20Chroma.)

## Create VectorDB from emails
Run:
```
npx tsx src/storing.ts "query"
```
It will parse all emails and then creates a chroma collection and import data if the collection doesn't exist. if the collection exists and is not empty, it doesn't add data. At the end, it looks for the "query" and returns the result.

The data stored in this step will be used for other commands.

## Find similar documents (RefineDocumentsChain)
Run:
```
npx tsx src/emailsRefineDocumentsChain.ts "query"
```

## Answer question ([ContextualCompressionRetriever](https://js.langchain.com/docs/modules/indexes/retrievers/contextual-compression-retriever))
Run:
```
npx tsx src/emailsContextualCompressionRetriever.ts "query"
```