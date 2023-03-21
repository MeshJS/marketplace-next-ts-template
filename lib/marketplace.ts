import { BasicMarketplace } from "@meshsdk/contracts";
import { KoiosProvider } from "@meshsdk/core";

export function getMarketplace(wallet) {
  const blockchainProvider = new KoiosProvider("preprod");

  const marketplace = new BasicMarketplace({
    fetcher: blockchainProvider,
    initiator: wallet,
    network: "preprod",
    signer: wallet,
    submitter: blockchainProvider,
    percentage: 25000, // 2.5%
    owner: "addr_test1vpvx0sacufuypa2k4sngk7q40zc5c4npl337uusdh64kv0c7e4cxr",
  });

  return marketplace;
}
