import { UfConfig } from "../billing/Types";
import { goConfig } from "./go";
import { dfConfig } from "./df";

export const ufConfigs: Record<string, UfConfig> = {
  [goConfig.uf]: goConfig,
  [dfConfig.uf]: dfConfig,
};

export function getUfConfig(uf: string): UfConfig | undefined {
  return ufConfigs[uf.toUpperCase()];
}
