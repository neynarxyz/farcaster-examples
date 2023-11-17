import { createPublicClient, http } from "viem";
import { optimism } from "viem/chains";

export const viemPublicClient = createPublicClient({
  chain: optimism,
  transport: http(),
});
