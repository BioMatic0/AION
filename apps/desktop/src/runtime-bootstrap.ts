import Module from "node:module";
import path from "node:path";

type MutableModuleApi = typeof Module & {
  _initPaths: () => void;
  globalPaths: string[];
};

const mutableModule = Module as MutableModuleApi;
const apiEntry = process.env.AION_API_ENTRY;

if (!apiEntry) {
  throw new Error("AION_API_ENTRY ist fuer den Desktop-Sidecar nicht gesetzt.");
}

const configuredNodePaths = (process.env.AION_RUNTIME_NODE_PATHS ?? "")
  .split(path.delimiter)
  .map((value) => value.trim())
  .filter(Boolean);

if (configuredNodePaths.length > 0) {
  const mergedNodePath = [...configuredNodePaths, process.env.NODE_PATH ?? ""]
    .filter(Boolean)
    .join(path.delimiter);

  process.env.NODE_PATH = mergedNodePath;
  mutableModule._initPaths();

  for (const runtimePath of configuredNodePaths) {
    if (!mutableModule.globalPaths.includes(runtimePath)) {
      mutableModule.globalPaths.unshift(runtimePath);
    }
  }
}

require(apiEntry);
