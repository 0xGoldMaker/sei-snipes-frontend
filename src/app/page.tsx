"use client";
import { Combobox } from "@headlessui/react";
import { useState, useMemo, useEffect } from "react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

import { SeiWalletProvider } from "@sei-js/react";
import { useWallet, WalletConnectButton, useQueryClient } from "@sei-js/react";

type BalanceResponseType = {
  amount: string;
  denom: string;
};

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function Home() {
  const rpcUrl = "YOUR_RPC_URL";
  const restUrl = "YOUR_REST_URL";
  const chainId = "atlantic-2";
  const { offlineSigner, connectedWallet, accounts } = useWallet();

  const [walletBalances, setWalletBalances] = useState<BalanceResponseType[]>([]);
  const walletAccount = useMemo(() => accounts?.[0], [accounts]);
  const { queryClient } = useQueryClient();

  const user_id = ""

  useEffect(() => {
    const fetchBalances = async () => {
      if (queryClient && walletAccount) {
        const { balances } = await queryClient.cosmos.bank.v1beta1.allBalances({ address: walletAccount.address });
        return balances as BalanceResponseType[];
      }
      return [];
    };

    fetchBalances().then(setWalletBalances);
  }, [offlineSigner]);

  const [runningScrapes, setRunningScrapes] = useState<
    Array<{
      id: string;
      collectionId: string;
      traits: Array<string>;
      targetPrice: number;
    }>
  >([]);

  const updateRunningScrapes = () => {
    fetch(`http://localhost:8000/api/snipe/saved`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ user_id: user_id }),
    })
      .then((res) => res.json())
      .then((data) =>
        data.map((d: { snipe_id: string; contract_address: string; target_price: number; traits: Array<any> }) => ({
          id: d.snipe_id,
          collectionId: d.contract_address,
          traits: d.traits,
          targetPrice: d.target_price,
        }))
      )
      .then((data) => setRunningScrapes(data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    updateRunningScrapes();
  }, []);

  const handleScrapeTaskDelete = (taskId: string) => {
    fetch(`http://localhost:8000/api/snipe`, {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ user_id: user_id, task_id: taskId }),
    }).catch((err) => console.log(err));
    updateRunningScrapes();
  };

  const [collectionQuery, setCollectionQuery] = useState("");
  const [selectedCollection, setSelectedCollection] = useState<{ contractAddress: string; name: string }>({
    contractAddress: "",
    name: "",
  });
  const [collectionList, setCollectionList] = useState<Array<{ contractAddress: string; name: string }>>([]);

  const handleOnCollectionQueryChange = (event: any) => {
    if (event.target.value == "") {
      setCollectionList([]);
      setSelectedCollection({
        contractAddress: "",
        name: "",
      });
      setTraits({});
      setSelectedTrait(null);
      return;
    }

    fetch(`http://localhost:8000/api/collection/search/${event.target.value}`)
      .then((response) => response.json())
      .then((collection: Array<{ contract_address: string; name: string }>) => {
        return collection.map((item) => ({ contractAddress: item.contract_address, name: item.name }));
      })
      .then((collections) => setCollectionList(collections))
      .catch((err) => console.log(err));
  };


  const [traits, setTraits] = useState<{
    [traitName: string]: Array<{ value: string; num_tokens: number; display_type: any; rarity: any }>;
  }>({});
  const [selectedTrait, setSelectedTrait] = useState<{ trait: string; val: string } | null>(null);

  const handleOnSelectedCollectionChange = (event: any) => {
    setSelectedCollection({ contractAddress: event.contractAddress, name: event.name });
    fetch(`http://localhost:8000/api/traits/${event.contractAddress}`)
      .then((res) => res.json())
      .then((traitCollection) => setTraits(traitCollection));
  };


  const [traitQuery, setTraitQuery] = useState('')


  const [targetPrice, setTargetPrice] = useState(0);

  const submitTask = () => {
    fetch(`http://localhost:8000/api/snipe`, {
      method: "POST",
      body: JSON.stringify({
        user_id: user_id,
        contract_address: selectedCollection.contractAddress,
        target_price: targetPrice,
        trait: selectedTrait,
      }),
      headers: { "Content-Type": "application/json" },
    });
    updateRunningScrapes();
  };

  return (
    <SeiWalletProvider chainConfiguration={{ chainId, restUrl, rpcUrl }} wallets={["compass"]}>
      <div className="flex flex-col items-stretch justify-stretch">
        <div className="flex py-3 px-6 border-1 ring-1 bg-slate-400">
          {!connectedWallet ? <WalletConnectButton /> : <p>connected to {connectedWallet.walletInfo.name}</p>}
        </div>
        <div className="container mx-auto w-1/2">
          <div className="flex flex-col items-center justify-center gap-">
            <div>Snipe</div>
            <div className="grid grid-cols-3 gap-6 items-center">
              <div className="col-span-1 text-right">Collection: </div>
              <Combobox
                className="col-span-2"
                as="div"
                value={selectedCollection}
                onChange={(event) => handleOnSelectedCollectionChange(event)}
              >
                <div className="relative">
                  <Combobox.Input
                    className="w-full rounded border-0 bg-white px-4 py-1 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    onChange={(event) => handleOnCollectionQueryChange(event)}
                    displayValue={(collection: { collectionAddress: string; name: string }) => collection?.name}
                  />
                  <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </Combobox.Button>

                  {collectionList.length > 0 && (
                    <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {collectionList.map((collection) => (
                        <Combobox.Option
                          key={collection.name}
                          value={collection}
                          className={({ active }) =>
                            classNames(
                              "relative cursor-default select-none py-2 pl-8 pr-4",
                              active ? "bg-indigo-600 text-white" : "text-gray-900"
                            )
                          }
                        >
                          {({ active, selected }) => (
                            <>
                              <span className={classNames("block truncate", selected && "font-semibold")}>
                                {collection.name}
                              </span>

                              {selected && (
                                <span
                                  className={classNames(
                                    "absolute inset-y-0 left-0 flex items-center pl-1.5",
                                    active ? "text-white" : "text-indigo-600"
                                  )}
                                >
                                  <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                </span>
                              )}
                            </>
                          )}
                        </Combobox.Option>
                      ))}
                    </Combobox.Options>
                  )}
                </div>
              </Combobox>

              <div className="col-span-1 text-right">Target Price:</div>
              <input
                type="number"
                className="col-span-2 rounded ring-2 ring-inset ring-gray-400 shadow px-4 py-1"
                value={targetPrice}
                onChange={(e) => setTargetPrice(parseFloat(e.target.value))}
              />

              <div className="col-span-1 text-right ">Traits (optional):</div>
              <div className="col-span-2 w-3/4 flex flex-col gap-2">
                {selectedCollection.contractAddress == "" ? (
                  <div>No collection chosen</div>
                ) : Object.entries(traits).length == 0 ? (
                  <div>No trait available</div>
                ) : (<Combobox className="col-span-2"
                as="div"
                value={selectedTrait}
                onChange={setSelectedTrait}>
                  <Combobox.Input
          className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
                </Combobox>)}
              </div>

              <button
                type="submit"
                className="col-span-3 p-1 ring-1 shadow hover:shadow-slate-800 shadow-zinc-700 bg-slate-700 text-white hover:bg-gray-800"
                onClick={submitTask}
              >
                Start
              </button>
            </div>
          </div>
          <div className="flex flex-col items-stretch mx-auto max-w-4xl pt-16">
            <div className="text-center ">Running scrapes</div>
            <hr />
            {runningScrapes.length == 0 ? (
              <div v-if="runningScrapes.length == 0" className="text-center">
                No scrapes running right now
              </div>
            ) : (
              <table v-else className="divide-y text-center">
                <thead>
                  <tr>
                    <th scope="col">Id</th>
                    <th scope="col">Collection</th>
                    <th scope="col">Traits</th>
                    <th scope="col">Target Price</th>
                    <th scope="col">
                      <span className="sr-only">Delete</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {runningScrapes.map((scrape) => (
                    <tr>
                      <td>{scrape.id}</td>
                      <td>{scrape.collectionId}</td>
                      <td>{Object.values(scrape.traits).join(", ")}</td>
                      <td>{scrape.targetPrice}</td>
                      <td>
                        <button
                          type="button"
                          className="bg-gray-600 text-white px-3 py-1 rounded"
                          onClick={() => handleScrapeTaskDelete(scrape.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </SeiWalletProvider>
  );
}
