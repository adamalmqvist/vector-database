import VectorStore from "./VectorStore";

const main = () => {
  const vector = [1, 2, 3, 4];
  const db = new VectorStore();
  db.addVector("testId", vector);
  const vectorRes = db.getVector("testId");
  console.log("vectorRes", vectorRes);
  const result = db.findSimilarVectors(vector);
  console.log("result", result);
};
main();
