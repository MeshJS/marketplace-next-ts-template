import { addListing, updateListing, deleteListing } from "@/lib/axios";
import { getMarketplace } from "@/lib/marketplace";
import { Item } from "@/type/item";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { useWallet } from "@meshsdk/react";
import { useEffect, useState } from "react";
import AssetImage from "./AssetImage";
import Toast from "./Toast";

export default function AssetModal({
  showModalItem,
  setShowModalItem,
}: {
  showModalItem: Item | undefined;
  setShowModalItem: Function;
}) {
  const { connected, wallet } = useWallet();
  const [loading, setLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<undefined | any>(undefined);
  const [walletAddress, updateWalletAddress] = useState<string>("");
  const [listPrice, updateListPrice] = useState<string>("0");

  useEffect(() => {
    async function load() {
      const walletAddress = (await wallet.getUsedAddresses())[0];
      updateWalletAddress(walletAddress);
    }
    if (connected && walletAddress == "") {
      load();
    }
  }, [connected]);

  useEffect(() => {
    function closeToast() {
      setToastMessage(undefined);
    }
    if (toastMessage !== undefined) {
      setTimeout(function () {
        closeToast();
      }, 5000);
    }
  }, [toastMessage]);

  useEffect(() => {
    if (showModalItem !== undefined) {
      if (showModalItem.listing) {
        updateListPrice((showModalItem.listing.price / 1000000).toString());
      } else {
        updateListPrice("10");
      }
    }
  }, [showModalItem]);

  async function purchase() {
    if (showModalItem == undefined) return;

    setLoading(true);
    setToastMessage(undefined);

    try {
      const marketplace = getMarketplace(wallet);
      const txHash = await marketplace.purchaseAsset(
        showModalItem.listing?.seller,
        showModalItem.unit,
        showModalItem.listing?.price
      );
      const res = await deleteListing(showModalItem.unit);
      setShowModalItem(undefined);
      setToastMessage("Item purchased");
    } catch (error) {
      console.error(error);
      setToastMessage("Problem listing item, try again later");
    }
    setLoading(false);
  }

  async function list() {
    if (showModalItem == undefined) return;

    if (parseInt(listPrice) < 10) {
      setToastMessage("Price must be at least 10");
      return;
    }

    setLoading(true);
    setToastMessage(undefined);

    try {
      const marketplace = getMarketplace(wallet);
      const address = (await wallet.getUsedAddresses())[0];

      if (showModalItem.listing === undefined) {
        const txHash = await marketplace.listAsset(
          address,
          showModalItem.unit,
          parseInt(listPrice) * 1000000
        );
        const res = await addListing({
          ...showModalItem,
          listing: {
            seller: address,
            price: parseInt(listPrice) * 1000000,
          },
        });
        setShowModalItem(undefined);
        setToastMessage("Item listed for sale");
      }
      if (showModalItem.listing) {
        const txHash = await marketplace.relistAsset(
          address,
          showModalItem.unit,
          showModalItem.listing?.price,
          parseInt(listPrice) * 1000000
        );
        let _updateListing = {
          ...showModalItem,
          listing: {
            ...showModalItem.listing,
            price: parseInt(listPrice) * 1000000,
          },
        };
        delete _updateListing["_id"];
        const res = await updateListing(_updateListing);
        setShowModalItem(undefined);
        setToastMessage("Listing updated");
      }
    } catch (error) {
      console.error(error);
      setToastMessage("Problem listing item, try again later");
    }

    setLoading(false);
  }

  async function cancel() {
    if (showModalItem == undefined) return;

    setLoading(true);
    setToastMessage(undefined);

    try {
      const marketplace = getMarketplace(wallet);
      const address = (await wallet.getUsedAddresses())[0];
      const txHash = await marketplace.delistAsset(
        address,
        showModalItem.unit,
        showModalItem.listing?.price
      );
      const res = await deleteListing(showModalItem.unit);
      setShowModalItem(undefined);
      setToastMessage("Listing cancelled");
    } catch (error) {
      console.error(error);
      setToastMessage("Problem listing item, try again later");
    }

    setLoading(false);
  }

  if (showModalItem !== undefined) {
    return (
      <>
        {toastMessage && (
          <Toast show={true}>
            <p>{toastMessage}</p>
          </Toast>
        )}

        <div className="relative z-10">
          <div className="fixed inset-0 hidden bg-gray-500 bg-opacity-75 transition-opacity md:block"></div>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
              <div className="flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-4 lg:max-w-4xl">
                <div className="h-96 relative flex w-full items-center overflow-hidden bg-white px-4 pt-14 pb-8 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
                  <button
                    type="button"
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 sm:top-8 sm:right-6 md:top-6 md:right-6 lg:top-8 lg:right-8"
                    onClick={() => setShowModalItem(undefined)}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" />
                  </button>

                  <div className="grid w-full grid-cols-1 items-start gap-y-8 gap-x-6 sm:grid-cols-12 lg:gap-x-8 auto-cols-auto">
                    <div className="aspect-w-2 aspect-h-3 overflow-hidden rounded-lg bg-gray-100 col-span-4">
                      <AssetImage
                        image={showModalItem.metadata.image}
                        className="object-cover object-center"
                      />
                    </div>

                    <div className="col-span-8 flex flex-col h-full">
                      <section className="flex-none">
                        <h2 className="text-2xl font-bold text-gray-900 sm:pr-12">
                          {showModalItem.metadata.name}
                        </h2>
                      </section>

                      {showModalItem.listing && (
                        <section className="flex-none">
                          <p className="text-2xl text-gray-900">
                            ₳ {showModalItem.listing.price / 1000000}
                          </p>
                        </section>
                      )}

                      <section className="h-full"></section>

                      <section className="flex-none">
                        {showModalItem.listing &&
                          showModalItem.owner != walletAddress && (
                            <button
                              className={`mt-6 flex w-full items-center justify-center rounded-md border border-transparent py-3 px-8 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 bg-indigo-600 hover:bg-indigo-700`}
                              onClick={() => purchase()}
                              disabled={!connected || loading}
                            >
                              {loading
                                ? "loading..."
                                : connected
                                ? "Purchase"
                                : "Connect wallet to purchase"}
                            </button>
                          )}

                        {showModalItem.owner == walletAddress && (
                          <>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                ₳
                              </div>
                              <input
                                className="block w-full rounded-md border-0 p-4 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="Listing price"
                                onChange={(e) =>
                                  updateListPrice(e.target.value)
                                }
                                value={listPrice}
                                type="number"
                              />
                              <TransactionButton
                                connected={connected}
                                loading={loading}
                                onClick={() => list()}
                                label={
                                  showModalItem.listing === undefined
                                    ? "List item for sale"
                                    : "Update listing price"
                                }
                              />
                            </div>
                            {showModalItem.listing && (
                              <button
                                className={`mt-6 flex w-full items-center justify-center rounded-md border border-transparent py-3 px-8 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 bg-red-600 hover:bg-red-700`}
                                onClick={() => cancel()}
                                disabled={!connected || loading}
                              >
                                {loading
                                  ? "loading..."
                                  : connected
                                  ? "Cancel listing"
                                  : "Connect wallet to cancel listing"}
                              </button>
                            )}
                          </>
                        )}
                      </section>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } else if (toastMessage) {
    return (
      <>
        <Toast show={true}>
          <p>{toastMessage}</p>
        </Toast>
      </>
    );
  } else {
    return <></>;
  }
}

function TransactionButton({ connected, loading, onClick, label }) {
  return (
    <button
      className={`text-white absolute right-2.5 bottom-2.5 bg-indigo-600 hover:bg-indigo-700 font-medium rounded-lg text-sm px-4 py-2 dark:bg-indigo-600 dark:hover:bg-indigo-700`}
      onClick={onClick}
      disabled={!connected || loading}
    >
      {loading ? "loading..." : label}
    </button>
  );
}
