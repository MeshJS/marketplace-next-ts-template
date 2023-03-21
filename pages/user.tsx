import { AssetExtended, AssetMetadata } from "@meshsdk/core";
import { useWallet } from "@meshsdk/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { KoiosProvider } from "@meshsdk/core";
import AssetImage from "@/components/AssetImage";
import { ArrowPathIcon } from "@heroicons/react/20/solid";
import AssetModal from "@/components/AssetModal";
import { Item } from "@/type/item";
import { getListingsUser } from "@/lib/axios";

const blockchainProvider = new KoiosProvider(process.env.NEXT_PUBLIC_NETWORK!);

export default function Collection() {
  const [assets, setAssets] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModalItem, setShowModalItem] = useState<Item | undefined>(
    undefined
  );
  const { connected, wallet } = useWallet();

  async function getMetadata(assets) {
    // let updatedAssets: Item[] = [];
    // for (let i in assets) {
    //   const asset = assets[i];
    //   try {
    //     const metadata = await blockchainProvider.fetchAssetMetadata(
    //       asset.unit
    //     );
    //     let thisAsset: Item = {
    //       unit: asset.unit,
    //       metadata: {
    //         image: metadata.image,
    //         name: metadata.name,
    //       },
    //       owner: walletAddress,
    //     };
    //     updatedAssets.push(thisAsset);
    //   } catch (error) {}
    //   break; // todo remove
    // }

    // setAssets(updatedAssets);

    ///

    let userAssetsMetadata = {};
    for (let i in assets) {
      const asset = assets[i];
      try {
        const metadata = await blockchainProvider.fetchAssetMetadata(
          asset.unit
        );
        userAssetsMetadata[asset.unit] = metadata;
      } catch (error) {}
      break; // todo remove
    }
    return userAssetsMetadata;
  }

  async function getUserListings() {
    const walletAddress = (await wallet.getUsedAddresses())[0];
    const _userListings = await getListingsUser(walletAddress);
    console.log("_userListings", walletAddress, _userListings);

    let userListings = {};
    _userListings.map((item, i) => {
      userListings[item.unit] = item;
    });

    return userListings;
  }

  useEffect(() => {
    async function load() {
      setLoading(true);
      const assets = await wallet.getAssets();
      const userListings = await getUserListings();
      console.log("userListings", userListings);
      const userAssetsMetadata = await getMetadata(assets);

      // prepare Item[]
      const walletAddress = (await wallet.getUsedAddresses())[0];

      let updatedAssets: Item[] = [];
      for (let i in assets) {
        const asset = assets[i];
        try {
          const metadata = userAssetsMetadata[asset.unit];
          if (metadata == undefined) continue;

          let thisAsset: Item = {
            unit: asset.unit,
            metadata: {
              image: metadata.image,
              name: metadata.name,
            },
            owner: walletAddress,
          };

          const listedItem = userListings[asset.unit];
          if (listedItem) {
            thisAsset.listing = listedItem.listing;
          }

          updatedAssets.push(thisAsset);
        } catch (error) {}
      }

      for (let unit in userListings) {
        updatedAssets.push(userListings[unit]);
      }

      setAssets(updatedAssets);

      setLoading(false);
    }
    if (connected && !loading) {
      load();
    }
  }, [connected]);

  console.log("-- assets", assets);

  return (
    <>
      <AssetModal
        showModalItem={showModalItem}
        setShowModalItem={setShowModalItem}
      />
      <div className="bg-white">
        <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
          {!connected && (
            <div className="inline-flex items-center justify-center w-full">
              <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900">
                Connect wallet to view assets
              </h1>
            </div>
          )}

          {loading && (
            <div className="flex flex-row justify-center items-center">
              <ArrowPathIcon className="w-48 h-48 text-gray-500 dark:text-gray-400 animate-spin" />
            </div>
          )}

          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {assets
              .sort((a, b) => {
                if (a.listing && b.listing === undefined) return -1;
                if (a.listing === undefined && b.listing) return 1;
                return 0;
              })
              .map((asset, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setShowModalItem(asset);
                  }}
                >
                  <div className="group">
                    <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8">
                      <AssetImage
                        image={asset.metadata.image}
                        className="h-full w-full object-cover object-center group-hover:opacity-75"
                      />
                    </div>
                    <h3 className="mt-4 text-sm text-gray-700">
                      {asset.metadata.name}
                    </h3>
                    {asset.listing && (
                      <p className="mt-1 text-lg font-medium text-gray-900">
                        ₳ {asset.listing.price / 1000000}
                      </p>
                    )}
                  </div>
                </button>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
