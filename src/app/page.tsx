"use client";
import { Combobox } from "@headlessui/react";
import { useState, useMemo, useEffect } from "react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { SeiWalletProvider } from "@sei-js/react";
import { useWallet, WalletConnectButton, useQueryClient } from "@sei-js/react";
import { ThemeSwitch } from "../components/ThemeSwitch";
import Image from "next/image";
import Connect from "../components/Connect/Connect";
import SMContainer from "../components/SociaMediaContainer/SMContainer";
import logo from "../../public/logo/seisaw.png";
import seibots from "../../public/logo/seibots.png"
import Snipe from "@/components/Snipe/Snipe";
import { useSigningClient } from "@sei-js/react";


type BalanceResponseType = {
  amount: string;
  denom: string;
};

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function Home() {
  const user_id=""
  const rpcUrl = "https://rpc.atlantic-2.seinetwork.io";
  const restUrl = "https://rest.atlantic-2.seinetwork.io";
  const chainId = "atlantic-2";


  const { signingClient, isLoading } = useSigningClient(rpcUrl);
  const { offlineSigner, connectedWallet, accounts } = useWallet();
  const walletAccount = useMemo(() => accounts?.[0], [accounts]);

  const { queryClient } = useQueryClient();
  const [walletBalances, setWalletBalances] = useState<BalanceResponseType[]>([]);
  const [runningScrapes, setRunningScrapes] = useState<any[]>([]);
  const [collectionQuery, setCollectionQuery] = useState("");
  
  
  const [selectedCollection, setSelectedCollection] = useState<{
    contractAddress: string;
    name: string;
  }>({
    contractAddress: "",
    name: "",
  });
  const [collectionList, setCollectionList] = useState<any[]>([]);

  const [traits, setTraits] = useState<{
    [traitName: string]: Array<{
      value: string;
      num_tokens: number;
      display_type: any;
      rarity: any;
    }>;
  }>({});
  const [selectedTrait, setSelectedTrait] = useState<{
    trait: string;
    val: string;
  } | null>(null);

  const [traitQuery, setTraitQuery] = useState("");
  const [targetPrice, setTargetPrice] = useState(0);

  if(!isLoading){
    console.log(isLoading)
    useSigningClient();
  }

  const fetchBalances = async () => {
    if (queryClient && walletAccount) {
      const { balances } = await queryClient.cosmos.bank.v1beta1.allBalances({
        address: walletAccount.address,
      });
      setWalletBalances(balances as BalanceResponseType[]);
    }
  };

  // const fetchRunningScrapes = () => {
  //   fetch(`https://app.seisaw.xyz/api/snipe/saved`, {
  //     method: "POST",
  //     headers: { "content-type": "application/json" },
  //     body: JSON.stringify({ user_id }),
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setRunningScrapes(
  //         data.map((d: any) => ({
  //           id: d.snipe_id,
  //           collectionId: d.contract_address,
  //           traits: d.traits,
  //           targetPrice: d.target_price,
  //         }))
  //       );
  //     })
  //     .catch((err) => console.log(err));
  // };

//   useEffect(() => {
//     fetchBalances();
//   }, [offlineSigner]);

//   useEffect(() => {
//     fetchRunningScrapes();
//   }, []);

  // const handleScrapeTaskDelete = (taskId: string) => {
  //   fetch(`https://app.seisaw.xyz/api/snipe`, {
  //     method: "DELETE",
  //     headers: { "content-type": "application/json" },
  //     body: JSON.stringify({ user_id, task_id: taskId }),
  //   }).catch((err) => console.log(err));
  //   fetchRunningScrapes();
  // };

  // const handleOnCollectionQueryChange = (event: any) => {
  //   const query = event.target.value;
  //   if (query === "") {
  //     setCollectionList([]);
  //     setSelectedCollection({ contractAddress: "", name: "" });
  //     setTraits({});
  //     setSelectedTrait(null);
  //     return;
  //   }

  //   fetch(`https://app.seisaw.xyz/api/collection/search/${query}`)
  //     .then((response) => response.json())
  //     .then((collection) => {
  //       const formattedCollection = collection.map((item: any) => ({
  //         contractAddress: item.contract_address,
  //         name: item.name,
  //       }));
  //       setCollectionList(formattedCollection);
  //     })
  //     .catch((err) => console.log(err));
  // };

  // const handleOnSelectedCollectionChange = (event: any) => {
  //   const selected = event;
  //   setSelectedCollection(selected);
  //   fetch(`https://app.seisaw.xyz/api/traits/${selected.contractAddress}`)
  //     .then((res) => res.json())
  //     .then((traitCollection) => setTraits(traitCollection))
  //     .catch((err) => console.log(err));
  // };

  // const submitTask = () => {
  //   fetch(`https://app.seisaw.xyz/api/snipe`, {
  //     method: "POST",
  //     body: JSON.stringify({
  //       user_id: user_id,
  //       contract_address: selectedCollection.contractAddress,
  //       target_price: targetPrice,
  //       trait: selectedTrait,
  //     }),
  //     headers: { "Content-Type": "application/json" },
  //   })
  //     .then(() => fetchRunningScrapes())
  //     .catch((err) => console.log(err));
  // };

  return (
    <SeiWalletProvider
      chainConfiguration={{ chainId, restUrl, rpcUrl }}
      wallets={["compass","keplr", "leap"]}
    >
        <div className="flex items-center justify-center h-screen">
          <main className="relative w-full lg:w-[40%] h-[100vh] dark:bg-gradient-to-bl bg-gradient-to-bl from-[#F3F3F3] to-[#F8F8F8] dark:border-none border border-gray-100 drop-shadow-md">
            {connectedWallet && (
            <div className="absolute w-40 h-40 bg-red-500 left-0 top-0 dark:text-black z-100">
              <button disabled>
                <WalletConnectButton buttonClassName="bg-gray-100 text-gray-500 rounded-md px-2 py-1" />
              </button>
            </div>
          )}
            <div className="absolute right-4 cursor-pointer mt-4">
              <div>
                <ThemeSwitch />
              </div>
            </div>
            <div className="flex justify-center">
              <Image
                src={logo}
                width={0}
                height={0}
                alt="SeiSaw Logo"
                className="w-[100px] h-[100px]"
              />
            </div>
            <br />
            <div className="flex justify-center drop-shadow-xl">
              <Connect />
            </div>
            

            <br />
            <div className="absolute w-full bottom-20 flex justify-center">
              <span className="text-center flex gap-1 items-center">Powered by SeiBots<Image src={seibots} width={32} height={32} alt="🤖"/></span>
            </div>
            <div className="absolute flex justify-center bottom-4 w-full">
              <SMContainer />
            </div>
          </main>
        </div>
      {/*<div className="flex flex-col items-stretch justify-stretch">
         {connectedWallet && (
            <Snipe />
        )} */}
        {/* <div className="flex py-3 px-6 border-1 ring-1 bg-slate-400">
          {!connectedWallet ? (
            <WalletConnectButton buttonClassName="px-6 py-3 rounded-full text-white flex gap-1 bg-gradient-to-br from-sky-600 to-sky-400 hover:bg-gradient-to-br hover:from-emerald-400 hover:to-emerald-500 drop-shadow-lg" />
          ) : (
            <p>connected to {connectedWallet.walletInfo.name}</p>
          )}
        </div> */}
        {/* <div className="container mx-auto w-1/2">
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
                    displayValue={(collection: {
                      collectionAddress: string;
                      name: string;
                    }) => collection?.name}
                  />
                  <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                    <ChevronUpDownIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
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
                              active
                                ? "bg-indigo-600 text-white"
                                : "text-gray-900"
                            )
                          }
                        >
                          {({ active, selected }) => (
                            <>
                              <span
                                className={classNames(
                                  "block truncate",
                                  selected && "font-semibold"
                                )}
                              >
                                {collection.name}
                              </span>

                              {selected && (
                                <span
                                  className={classNames(
                                    "absolute inset-y-0 left-0 flex items-center pl-1.5",
                                    active ? "text-white" : "text-indigo-600"
                                  )}
                                >
                                  <CheckIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
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
                ) : (
                  <Combobox
                    className="col-span-2"
                    as="div"
                    value={selectedTrait}
                    onChange={setSelectedTrait}
                  >
                    <Combobox.Input className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                  </Combobox>
                )}
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
      </div>*/}
    </SeiWalletProvider>
  );
}
