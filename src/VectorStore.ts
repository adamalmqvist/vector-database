import * as fs from "fs";

type Metadata = {
  [key: string]: string | number | boolean | object;
};

type VectorObject = {
  vector: number[];
  metadata: Metadata;
};

class VectorStore {
  constructor() {
    fs.writeFileSync(
      __dirname + "/vectorData.json",
      JSON.stringify({}, null, 2)
    );
  }

  get vectorData(): Record<string | number, VectorObject> {
    var obj = JSON.parse(
      fs.readFileSync(__dirname + "/vectorData.json", "utf8")
    );
    return obj;
  }

  addVector(vectorId: string | number, vector: number[], metadata?: any): void {
    const data = { ...this.vectorData };
    data[vectorId] = { vector, metadata };
    fs.writeFileSync(
      __dirname + "/vectorData.json",
      JSON.stringify(data, null, 2)
    );
  }

  getVector(vectorId: string | number): VectorObject | undefined {
    return this.vectorData[vectorId];
  }

  calculateCosineSimilarity(vec1: number[], vec2: number[]): number {
    let dotProduct = 0;
    let normVec1 = 0;
    let normVec2 = 0;
    for (let i = 0; i < vec1.length; i++) {
      dotProduct += vec1[i] * vec2[i];
      normVec1 += vec1[i] * vec1[i];
      normVec2 += vec2[i] * vec2[i];
    }
    normVec1 = Math.sqrt(normVec1);
    normVec2 = Math.sqrt(normVec2);
    if (normVec1 === 0 || normVec2 === 0) {
      return 0;
    }
    return dotProduct / (normVec1 * normVec2);
  }

  isVectorPassingMetadataFilter(
    item: VectorObject,
    criteria?: Partial<Metadata>
  ) {
    if (!criteria) {
      return true;
    }
    return Object.entries(criteria).every(
      ([key, value]) => item.metadata[key] === value
    );
  }

  findSimilarVectors(
    query: number[],
    k = 5,
    metadataFilter?: Partial<Metadata>
  ) {
    const results = [];
    for (const id in this.vectorData) {
      const item = this.getVector(id);
      if (item) {
        const { vector } = item;
        const similarity = this.calculateCosineSimilarity(query, vector);
        results.push({
          id,
          similarity,
        });
      }
    }
    results.sort((a, b) => {
      return b.similarity - a.similarity;
    });

    return results
      .filter((item) => {
        const vector = this.getVector(item.id);
        if (vector) {
          return this.isVectorPassingMetadataFilter(vector, metadataFilter);
        }
      })
      .slice(0, k);
  }
}
export default VectorStore;
