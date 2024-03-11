"use client"
import React, { ButtonHTMLAttributes, useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";

import binoculars from "../../../public/assets/icons/binoculars-white.svg";
import binocularsBlack from "../../../public/assets/icons/binoculars.svg";

import { TbCrosshair } from "react-icons/tb";
import { ChevronRight } from "lucide-react";
import { Spinner } from "flowbite-react";
import { Tabs } from "flowbite-react";

import NftCard from "../NftCard/NftCard";
import SnipeCard from "../SnipeCard/SnipeCard";
import NeuButton from "../Button/NewuButton";

import useWalletStore from "@/store/useWalletStore";

import { useSigningClient } from "@sei-js/react";
import { useWallet, WalletConnectButton, useQueryClient } from "@sei-js/react";
import { COMPASS_WALLET, verifyArbitrary } from "@sei-js/core";

import { Toast } from 'flowbite-react';
import { HiCheck, HiX } from 'react-icons/hi';

interface NeuButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const Connect: React.FC<NeuButtonProps> = ({ ...props }) => {
  const { walletAddress, updateWalletAddress, botWallet, updateBotWallet, mainWalletBalance, updateMainWalletBalance } = useWalletStore();
  const [snipes, setSnipes] = useState([]);
  const [collectionList, setCollectionList] = useState([]);
  const [executed, setExecuted] = useState(false);

  const [selectedCollection, setSelectedCollection] = useState("");
  const [dropdownCollection, setDropdownCollection] = useState("");
  const [nftCollection, setNftCollection] = useState([]);
  const [collectionId, setCollectionId] = useState("");
  const [walletBalances, setWalletBalances] = useState<BalanceResponseType[]>([]);
  const { queryClient } = useQueryClient();
  const [collectionPfp, setCollectionPfp] = useState([]);
  const [collectionDayHigh, setCollectionDayHigh] = useState();

  const [collectionNameList, setCollectionNameList] = useState([]);
  const [nfts, setNfts] = useState([]);

  // const [walletAddress, setWalletAddress] = useState("");
  const { theme, setTheme } = useTheme();
  const { offlineSigner, connectedWallet, accounts } = useWallet();
  const [nftData, setNftData] = useState([]);
  const [collections, setCollections] = useState([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState("");
  const [selectedCollectionName, setSelectedCollectionName] = useState("");
  const [collectionFloor, setCollectionFloor] = useState("0.00");
  const [traitList, setTraitList] = useState([]);
  const [selectedTrait, setSelectedTrait] = useState(null);
  const [snipePrice, setSnipePrice] = useState();
  const walletAccount = useMemo(() => accounts?.[0], [accounts]);

  const date = new Date();
  date.setDate(date.getDate() + 2); 

  const [collectionAddress, setCollectionAddress] = useState("")
  const [message, setMessage] = useState("Access Grant");
  const [signature, setSignature] = useState("");
  const [verificationResult, setVerificationResult] = useState("");

  const signMessage = async () => {
      try {
          const stdSignature = await COMPASS_WALLET.signArbitrary('atlantic-2', walletAddress, message);
          setSignature(stdSignature);
      } catch (error) {
          console.error("Error signing message:", error);
      }
  };

  const verifySignature = async () => {
      try {
          const isVerified = await verifyArbitrary(walletAddress, message, signature);
          setVerificationResult(isVerified ? "Signature is valid" : "Signature is not valid");
      } catch (error) {
          console.error("Error verifying signature:", error);
          setVerificationResult("Error verifying signature");
      }
  };

  const { signingClient, isLoading } = useSigningClient(
    "https://sei-rpc.polkachu.com/"
  );
  const [targetPrice, setTargetPrice] = useState("");

  const handleTargetPrice = (e: any) => {
    setTargetPrice(e.target.value);
  };
  const handleSignMessage = () => {
    if (signingClient) {
      updateWalletAddress(accounts[0].address);
    }
  };

  const handleSelectTrait = (event) => {
    setSelectedTrait(event.target.value);
  };
  const handleSnipePriceChange =  () => {
    setSnipePrice(event.target.value);
  }

  // CREATE A USER IF NOT EXIST WITH AN ADDRESS
  const createUser = async () => {
    try {
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          "user_contract_address": walletAddress,
        })
      };
      fetch(
        `https://app.seisaw.xyz/api/user/create/`,
        options
      )
        .then((response) => response.json())
        .catch((err) => console.error(err));
    } catch (error: any) {
      console.error("Error:", error.message);
    }
  };

  // FETCH A USER FROM THE DATA AND CHECK FOR CURRENT ADDRESS
  const fetchUser = async () => {
    try {
        const response = await fetch(
            `https://app.seisaw.xyz/api/users/?user_contract_address=${walletAddress}`,
            {
                method: "GET",
                headers: { "User-Agent": "insomnia/8.6.1" }
            }
        );
        const responseData = await response.json();

        // Check if results exist and have at least one element
        if (responseData.results && responseData.results.length > 0) {
            updateBotWallet(responseData.results[0].bot_address, "line 137");
        } else {
          createUser()
            console.error("No results found or empty results array.");
        }
    } catch (error) {
        console.error("Error:", error.message);
    }
  };

  const fetchUserSnipes = async () => {
    try {
      const options = {
        method: "GET",
        headers: { "User-Agent": "insomnia/8.6.1" },
      };
      fetch(
        `https://app.seisaw.xyz/api/snipes/?user_contract_address=${walletAddress}`,
        options
      )
        .then((response) => response.json())
        .catch((err) => console.error(err));
        setSnipes(response.results)
    } catch (error: any) {
      console.error("Error:", error.message);
    }
  };
  useEffect(() => {
    fetchUser();
    fetchUserSnipes();
  }, []);

  const createSnipe = async () => {
    try {
        const options = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              "user_address":walletAddress,
              "collection_address": collectionAddress,
              "category": 1,
              "trait": selectedTrait,
              "target_price": snipePrice,
              "transfer_address": walletAddress,
              "expiry": date
              }),
        };
        
        const response = await fetch("https://app.seisaw.xyz/api/snipe/create/", options);
        
        if (!response.ok) {
            throw new Error("Failed to create snipe");
            window.alert("Sniping Failed");
            return(
              <Toast>
        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
          <HiX className="h-5 w-5" />
        </div>
        <div className="ml-3 text-sm font-normal">Sniping Unsuccessful</div>
        <Toast.Toggle />
      </Toast>)
        }  
        if(response.ok){
          window.alert("Snipe Created");
          return(
            <Toast>
        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
          <HiCheck className="h-5 w-5" />
        </div>
        <div className="ml-3 text-sm font-normal">Sniped successfully.</div>
        <Toast.Toggle />
      </Toast>)
        }
        const responseData = await response.json();
    } catch (error) {
        console.error("Error:", error.message);
    }
};

  useEffect(() => {
    try {
      const options = {
        method: "GET",
        headers: { "User-Agent": "insomnia/8.6.1" },
      };
      fetch(
        `https://app.seisaw.xyz/api/snipes/?user_contract_address=${walletAddress}`,
        options
      )
        .then((response) => response.json())
        .then((data) => {
          setSnipes(data.results); 
          const collections = data.results.map(
            (snipe: any) => snipe.collection
          );
          setCollectionList(collections);
        })
        .catch((err) => console.error(err));
    } catch (error: any) {
      console.error("Error:", error.message);
    }
  }, [walletAddress]);

  useEffect(() => {
    try {
      const options = {
        method: "GET",
        headers: { "User-Agent": "insomnia/8.6.1" },
      };
      fetch("https://app.seisaw.xyz/api/collections/", options)
        .then((response) => response.json())
        .then((data) => {
          const collectionNames = data.results.map(
            (collection: any) => collection.name
          );
          const collectionId = data.results.map(
            (collection: any) => collection.id
          );
          setCollectionNameList(collectionNames);
          setCollectionId(collectionId);
          setCollections(data.results);
        })
        .catch((err) => console.error(err));
    } catch (error: any) {
      console.error("Error:", error.message);
    }
  }, []);
  useEffect(() => {
    try {
      const options = {
        method: "GET",
        headers: { "User-Agent": "insomnia/8.6.1" },
      };
      fetch(
        `https://app.seisaw.xyz/api/nfts/?collection=${selectedCollectionId}`,
        options
      )
        .then((response) => response.json())
        .then((data) => {
          const nfts = data.results.map((nftC: any) => nftC.collection);
          setNftCollection(nfts);
          setNftData(data);
        })
        .catch((err) => console.error(err));
    } catch (error: any) {
      console.error("Error:", error.message);
    }
  }, [selectedCollectionId]);
  const handleSelectCollection = async (event: any) => {
    const selectedValue = event.target.value;
    setSelectedCollectionName(selectedValue);

    const selectedCollectionObject = collections.find(
      (collection) => collection.name === selectedValue
    );
    if (selectedCollectionObject) {
      setSelectedCollectionId(selectedCollectionObject.id);
      setCollectionFloor(selectedCollectionObject.floor)
      setCollectionAddress(selectedCollectionObject.contract_address)
      setCollectionDayHigh(selectedCollectionObject.volume_24hr)
    }
  };

  const fetchCollectionData = async () => {
    try {
      const options = {
        method: "GET",
        headers: { "User-Agent": "insomnia/8.6.1" },
      };
      fetch("https://app.seisaw.xyz/api/collections/", options)
        .then((response) => response.json())
        .then((data) => {
          setCollectionPfp(data.results);
        })
        .catch((err) => console.error(err));
    } catch (error: any) {
      console.error("Error:", error.message);
    }
  }
  useEffect(() => {
    fetchCollectionData()
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://app.seisaw.xyz/api/nfts/?collection=${selectedCollectionId}`
        );
        const data = await response.json();
        setNfts(data.results);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedCollectionId]);

  useEffect(() => {
    const fetchTraits = async () => {
      try {
        const options = {method: 'GET', headers: {'User-Agent': 'insomnia/8.6.1'}};
        const response = await fetch(
          `https://app.seisaw.xyz/api/unique_traits/${selectedCollectionId}`, options
        );
        const data = await response.json();
        setTraitList(data)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchTraits();
  }, [selectedCollectionId])

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
  

  useEffect(() => {
    if (!executed && walletBalances.length > 0) {
      const amount = parseInt(walletBalances[0].amount) / 1000000;
      updateMainWalletBalance(amount);
      setExecuted(true);
    }
  }, [executed, walletBalances]);

console.log(botWallet)

  return (
    <>
      {!walletAddress && (
        <div className="relative w-[500px] h-[500px] flex flex-col justify-center rounded-md dark:bg-gradient-to-tr bg-gradient-to-br from-[#ffffff] to-[#f8f8f8]">
          <div className="flex justify-center ">
            {theme === "dark" && (
              <Link href="#">
                <Image
                  src={binoculars}
                  width={100}
                  height={100}
                  alt="Sniper"
                  className="drop-shadow-lg"
                />
              </Link>
            )}
            {theme !== "dark" && (
              <Image
                src={binocularsBlack}
                width={100}
                height={100}
                alt="Sniper"
                className="drop-shadow-lg"
              />
            )}
          </div>
          <div className="flex flex-col gap-6">
            {!connectedWallet ? (
              <>
                <div className="flex justify-center">
                  <span className="font-bold text-4xl text-center">
                    SeiSaw helps
                    <br />
                    you snipe
                  </span>
                </div>
                <span className="flex justify-center gap-1 px-2">
                  Snipe NFT's with{" "}
                  <Link href={"#"}>
                    <span className="cursor-pointer text-sky-400">
                      pallet.exchange
                    </span>
                  </Link>
                </span>
                <div className="flex justify-center">
                  <NeuButton
                    Redirect={"#"}
                    LucideIcon={<ChevronRight />}
                    {...props}
                    customWalletButton={<WalletConnectButton />}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-center">
                  <span className="font-bold text-4xl text-center">
                    Complete
                    <br />
                    Registration
                  </span>
                </div>
                <span className="flex justify-center text-center gap-1 lg:px-16">
                  Sign this message to complete the registration. This is
                  gas-less and does not give any rights to SeiSaw over your
                  wallet.
                </span>
                <div className="flex justify-center">
                  <NeuButton
                    Redirect={"#"}
                    LucideIcon={<ChevronRight />}
                    {...props}
                    customWalletButton={
                      <>
                        <p>
                          Sign Message{" "}
                          {isLoading && (
                            <Spinner
                              aria-label="Default status example"
                              size="md"
                            />
                          )}
                        </p>
                      </>
                    }
                    onClick={handleSignMessage}
                  />
                </div>
              </>
            )}
          </div>
          <br />
          <div className="absolute text-center bottom-8 w-full px-2">
            <span className="font-regular">
              Got questions? Join our{" "}
              <span className="cursor-pointer underline text-sky-400">
                Discord
              </span>{" "}
              community
            </span>
          </div>
        </div>
      )}
      {walletAddress && (
        <>        
        <main className="relative mx-4 w-full h-[660px] rounded-sm dark:bg-gradient-to-bl bg-gradient-to-bl from-[#F3F3F3] to-[#F8F8F8] dark:border-none border border-gray-100 drop-shadow-md">
          <div className="px-4">
            <Tabs
              aria-label="Tabs with underline"
              style="underline"
              className="border-none"
            >
              
              <Tabs.Item active title="Create Snipes" icon={TbCrosshair}>
                <form className="flex gap-4">
                  <select
                    className="py-3 rounded-md border-none"
                    value={selectedCollectionName}
                    onChange={handleSelectCollection}
                  >
                    <option value="">Search Collections</option>
                    {collectionNameList.map((collection, index) => (
                      <option key={index} value={collection}>
                        {collection}
                      </option>
                    ))}
                  </select>
                  <select
                    className="py-3 rounded-md border-none"
                    value={selectedTrait}
                    onChange={handleSelectTrait}
                  >
                    <option value="">Trait (Optional)</option>
                    {traitList  && Object.keys(traitList).map((parentTrait, parentIndex) => (
                      <option key={parentIndex} value={parentTrait}>{parentTrait}</option>
                    ))}
                  </select>
                  {/*<select
                    className="py-3 rounded-md border-none"
                    value={selectedTrait}
                    onChange={handleSelectTrait}
                  >
                    <option value="">Sub-Trait</option>
                    {traitList  && Object.keys(traitList).map((parentTrait, parentIndex) => (
                      <option key={parentIndex} value={parentTrait}>{parentTrait}</option>
                    ))}
                  </select>*/}
                </form>
                <div className="flex gap-4 my-2">
                  <input className="rounded-md w-[110px] px-4" placeholder="Snipe for" onChange={handleSnipePriceChange}></input>
                  <button className="px-4 py-2 bg-[#001021] rounded-md text-white hover:bg-gray-500" onClick={createSnipe}>Snipe</button>
                  <span className="w-[180px] px-4 bg-gray-100 rounded-md flex items-center gap-1">FP: <span className="font-semibold">{collectionFloor} SEI</span></span>
                  <span className="w-[180px] px-2 bg-gray-100 rounded-md flex items-center gap-1">24 Hr Vol: {collectionDayHigh} SEI</span>
                </div>
               
                {/* <div
                  className="grid grid-cols-2 gap-2"
                  style={{
                    maxHeight: "400px",
                    overflowY: "auto",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
                  {snipes.length === 0 ? (
                    <span></span>
                  ) : (
                    snipes
                      .filter(
                        (snipe) =>
                          selectedCollection === "" ||
                          snipe.collection === selectedCollection
                      )
                      .map((snipe, index) => (
                        <NftCard
                          key={index}
                          collectionName={snipe.collection}
                          price={snipe.target_price}
                          name={snipe.name}
                          image="/assets/icons/twitterx.svg"
                        />
                      ))
                  )}
                </div>*/}
                <div className="h-[480px] lg:h-[460px]" style={{ overflowY: "auto", scrollbarWidth: "none", msOverflowStyle: "none" }}>
                  {selectedCollectionName === "" ? (
                    <div className="w-auto grid grid-cols-3 gap-4">
                      {collectionPfp.map(collection => (
                        <div key={collection.id} className="p-2 rounded-md flex flex-col bg-gradient-to-tr from-[#F3F3F3] to-[#F8F8F8] shadow-lg">
                          <img src={collection.pfp} alt={collection.name} width={200} height={200}/>
                          <h2>Name: {collection.name}</h2>
                          <span>Floor: {collection.floor}</span>
                          <span>24H Volume: {collection.volume_24hr}</span>
                          <span>Supply: {collection.supply}</span>
                          <span>Auction Count: {collection.auction_count}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="w-auto m-2">
                      {nfts && nfts.length > 0 ? (
                        <ul className="grid grid-cols-3 gap-8">
                          {nfts.map((nft) => (
                            <li key={nft.id} className="p-2 rounded-md bg-gradient-to-tr from-[#F3F3F3] to-[#F8F8F8] shadow-lg">
                              <h2>{nft.name}</h2>
                              <img src={nft.image} alt={nft.name} />
                              <ul>
                                {nft.traits.map((trait) => (
                                  <li key={trait.type}>
                                    <strong>{trait.type}:</strong> {trait.value}
                                  </li>
                                ))}
                              </ul>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>Loading...</p>
                      )}
                    </div>
                  )}
                </div>
              </Tabs.Item>
              <Tabs.Item active title="Snipes" icon={TbCrosshair}>
                <div className="h-[480px] lg:h-[420px]" style={{ overflowY: "auto", scrollbarWidth: "none", msOverflowStyle: "none" }}>
                  {snipes.map(item => (
                    <div key={item.id} className="shadow-lg w-[240px] p-4 rounded-md ">
                      <p>Collection Address: {item.collection_address.slice(-5)}</p>
                      <p>Target Price: {(item.target_price)/1000000}</p>
                      <p>Trait: {item.trait}</p>
                      <p>Already Sniped: {item.already_sniped}</p>
                      <p>Expiry: {item.expiry}</p>
                    </div>
                  ))}
                </div>
              </Tabs.Item>
            </Tabs>
          </div>
        </main>
        </>
      )}
    </>
  );
};

export default Connect;
