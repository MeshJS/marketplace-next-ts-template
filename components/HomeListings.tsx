import { getLatestListings, searchListings } from "@/lib/axios";
import { Item } from "@/type/item";
import { ArrowPathIcon, MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import AssetModal from "./AssetModal";
import AssetImage from "./AssetImage";
import Toast from "./Toast";

export default function HomeListings() {
  const [listings, setListings] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

  const [showModalItem, setShowModalItem] = useState<Item | undefined>(
    undefined
  );

  useEffect(() => {
    async function load() {
      setLoading(true);
      let data = await getLatestListings();
      setListings(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <>
      <AssetModal
        showModalItem={showModalItem}
        setShowModalItem={setShowModalItem}
      />
      <div className="bg-white">
        <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
          <Search
            loading={loading}
            setLoading={setLoading}
            setListings={setListings}
          />

          {loading ? (
            <div className="flex flex-row justify-center items-center">
              <ArrowPathIcon className="w-48 h-48 text-gray-500 dark:text-gray-400 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
              {listings.map((item, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setShowModalItem(item);
                  }}
                >
                  <div className="group">
                    <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8">
                      <AssetImage
                        image={item.metadata.image}
                        className="h-full w-full object-cover object-center group-hover:opacity-75"
                      />
                    </div>
                    <h3 className="mt-4 text-sm text-gray-700">
                      {item.metadata.name}
                    </h3>
                    {item.listing && (
                      <p className="mt-1 text-lg font-medium text-gray-900">
                        ₳ {item.listing.price / 1000000}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function Search({ loading, setLoading, setListings }) {
  const [userQuery, setUserQuery] = useState<string>("");

  useEffect(() => {
    setUserQuery("");
  }, []);

  async function search() {
    if (!loading && userQuery.length) {
      setLoading(true);
      let res = await searchListings(userQuery);
      setListings(res);
      setLoading(false);
    }
  }

  function handleKeyPress(event) {
    if (event.key === "Enter") {
      search();
    }
  }

  return (
    <div className="mx-8 my-20">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </div>
        <input
          className="block w-full rounded-md border-0 p-4 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="Search assets by policy ID"
          onChange={(e) => setUserQuery(e.target.value)}
          value={userQuery}
          onKeyDown={handleKeyPress}
        />
        <button className="text-white absolute right-2.5 bottom-2.5 bg-indigo-600 hover:bg-indigo-700 font-medium rounded-lg text-sm px-4 py-2 dark:bg-indigo-600 dark:hover:bg-indigo-700">
          Search
        </button>
      </div>
    </div>
  );
}
