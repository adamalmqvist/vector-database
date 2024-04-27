# vector-database

a super simple vector database in TypeScript without any packages (exept Jest for testing). It efficiently manages and retrieves vectors, featuring a straightforward cosine similarity search function for finding similar vectors in your database.

## Features

- Store vectors with unique identifiers.
- Retrieve vectors using identifiers.
- Search for similar vectors using cosine similarity.

## Getting Started

### Prerequisites

Ensure you have Node.js installed on your system to run TypeScript files. You can download Node.js from [nodejs.org](https://nodejs.org/).

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/adamalmqvist/vector-database.git
   cd vector-database
   ```

2. Install dependencies:
   ```
   npm install
   ```
3. Compile TypeScript to JavaScript (ensure you have TypeScript installed globally or use npx):
   ```
   npx tsc
   ```

### Usage

To use the VectorStore class in your TypeScript projects, import the class from your local files:

#### Adding a vector

```typescript
import { VectorStore } from "./path/to/VectorStore";

const store = new VectorStore();
store.addVector("vector1", [1, 2, 3]);
```

#### Getting a vector

```typescript
import { VectorStore } from "./path/to/VectorStore";

const store = new VectorStore();
const vector = store.getVector("vector1");
console.log(vector); // Output: [1, 2, 3]
```

#### Searching for similar vectors

```typescript
import { VectorStore } from "./path/to/VectorStore";

const store = new VectorStore();
const vector = store.findSimilarVectors([1, 2, 3]);
```

### Running Test

This project uses Jest for unit testing. To run tests, execute:

```
npm run test
```
