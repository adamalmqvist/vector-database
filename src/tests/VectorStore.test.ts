import * as fs from "fs";
import VectorStore from "../VectorStore";
import { car, cat, dog, highway } from "./mockData";

describe("VectorStore", () => {
  let store: VectorStore;

  beforeEach(() => {
    store = new VectorStore();
  });

  afterEach(() => {
    fs.writeFileSync(
      __dirname + "/../vectorData.json",
      JSON.stringify({}, null, 2)
    );
  });

  test("addVector and getVector", () => {
    const vectorId = "vec1";
    const vector = [1, 2, 3];
    store.addVector(vectorId, vector);

    expect(store.getVector(vectorId)).toEqual({ vector });
    expect(store.getVector("nonexistent")).toBeUndefined();
  });

  it("Handles metadata correctly when adding vectores", () => {
    const vectorId = "vec1";
    const vector = [1, 2, 3];
    const metadata = {
      id: "testid",
      orginalText: "This is some original text for a test",
    };
    store.addVector(vectorId, vector, metadata);
    expect(store.getVector(vectorId)).toEqual({ vector, metadata });
  });

  test("Two vectors that are exactly the same should have the similarity of 1", () => {
    const vector = [1, 2, 3];
    const similarity = store.calculateCosineSimilarity(vector, vector);
    expect(similarity).toBe(1);
  });

  test("Its finds similair vectors and sorts them correctly", () => {
    const vector1 = [1, 2, 3];
    const vector2 = [1, 3, 3];
    const vector3 = [1, 2, 6];
    store.addVector("vector1", vector1);
    store.addVector("vector2", vector2);
    store.addVector("vector3", vector3);

    const result = store.findSimilarVectors(vector3);
    expect(result[0]).toEqual({ id: "vector3", similarity: 1 });
  });

  test("findSimilarVectors handles k value correctly", () => {
    const vector1 = [1, 2, 3];
    const vector2 = [1, 3, 3];
    const vector3 = [1, 2, 6];
    store.addVector("vector1", vector1);
    store.addVector("vector2", vector2);
    store.addVector("vector3", vector3);

    const result = store.findSimilarVectors(vector3, 1);
    expect(result.length).toBe(1);
  });

  test("findSimilarVectors gets correct 'car' vector when searching with 'highway' vector", () => {
    store.addVector("dogVectorId", dog.vector, {
      orginalText: dog.orginalText,
    });
    store.addVector("catVectorId", cat.vector, {
      orginalText: cat.orginalText,
    });
    store.addVector("carVectorId", car.vector, {
      orginalText: car.orginalText,
    });

    const result = store.findSimilarVectors(highway.vector, 1);
    const vectorData = store.getVector(result[0].id);
    expect(vectorData?.metadata.orginalText).toBe("car");
  });

  test("findSimilarVectors handles metadata filtering", () => {
    store.addVector("dogVectorId", dog.vector, {
      orginalText: dog.orginalText,
    });
    store.addVector("catVectorId", cat.vector, {
      orginalText: cat.orginalText,
    });
    store.addVector("carVectorId", car.vector, {
      orginalText: car.orginalText,
      color: "red",
    });

    const result = store.findSimilarVectors(highway.vector, 1, {
      color: "red",
    });
    const vectorData = store.getVector(result[0].id);
    expect(vectorData?.metadata.orginalText).toBe("car");

    const result2 = store.findSimilarVectors(highway.vector, 1, {
      color: "greem",
    });
    expect(result2.length).toBe(0);
  });
});
