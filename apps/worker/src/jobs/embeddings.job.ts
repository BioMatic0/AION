import { createMemoryItem, routeMessage } from "@aion/ai-core";

export function runEmbeddingPreparation(message: string) {
  return {
    receivedAt: new Date().toISOString(),
    route: routeMessage(message),
    nextAction: "prepare-embeddings",
    memorySeed: createMemoryItem("manual", "Worker seed", message)
  };
}