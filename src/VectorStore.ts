import * as fs from "fs";

type VectorObject = {
  vector: number[];
  metaData: any;
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

  addVector(vectorId: string | number, vector: number[], metaData?: any): void {
    const data = { ...this.vectorData };
    data[vectorId] = { vector, metaData };
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

  findSimilarVectors(query: number[], k = 5) {
    const results = [];
    for (const key in this.vectorData) {
      const { vector } = this.vectorData[key];
      const similarity = this.calculateCosineSimilarity(query, vector);
      results.push({
        id: key,
        similarity,
      });
    }
    results.sort((a, b) => {
      return b.similarity - a.similarity;
    });

    return results;
  }
}
export default VectorStore;
