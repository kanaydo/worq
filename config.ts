import { file } from "bun";
import { homedir } from "os";
import { join } from "path";

export const buildUserConfig = async () => {
  const defaultConfig = { dirs: [] };
  let config = defaultConfig;

  const configPath = join(homedir(), ".config", "worq.json");
  const configFound = await file(configPath).exists();
  if (configFound) {
    config = await file(configPath).json();
  } else {
    console.log("config file not found, creating..");
    await Bun.write(configPath, JSON.stringify(defaultConfig, null, 2));
  }
  return { config: config, configPath: configPath };
};
