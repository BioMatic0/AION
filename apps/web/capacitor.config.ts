import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.patrickwirth.aion",
  appName: "AION",
  webDir: "out",
  backgroundColor: "#f6f1e7",
  android: {
    allowMixedContent: true
  },
  ios: {
    contentInset: "automatic"
  }
};

export default config;
