import { runEmbeddingPreparation } from "./jobs/embeddings.job.js";

const sample = runEmbeddingPreparation("Prepare AION session memory embeddings.");
console.log("AION worker booted", sample);