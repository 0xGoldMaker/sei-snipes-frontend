"use client";
import React, { ButtonHTMLAttributes, useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import NeuButton from "../Button/NewuButton";
import Image from "next/image";
import Link from "next/link";
import binoculars from "../../../public/assets/icons/binoculars-white.svg";
import binocularsBlack from "../../../public/assets/icons/binoculars.svg";
import { useWallet, WalletConnectButton, useQueryClient } from "@sei-js/react";
import { useTheme } from "next-themes";
import { useSigningClient } from "@sei-js/react";
import { Spinner } from "flowbite-react";
import useWalletStore from "@/store/useWalletStore";
import { TbCrosshair } from "react-icons/tb";
import SnipeCard from "../SnipeCard/SnipeCard";
import { Tabs } from "flowbite-react";
import NftCard from "../NftCard/NftCard";
import { COMPASS_WALLET, verifyArbitrary } from "@sei-js/core";

interface NeuButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const Connect: React.FC<NeuButtonProps> = ({ ...props }) => {
  const { walletAddress, updateWalletAddress } = useWalletStore();
  const [snipes, setSnipes] = useState([]);
  const [collectionList, setCollectionList] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState("");
  const [dropdownCollection, setDropdownCollection] = useState("");
  const [nftCollection, setNftCollection] = useState([]);
  const [collectionId, setCollectionId] = useState("");
    const [walletBalances, setWalletBalances] = useState<BalanceResponseType[]>([]);
  const { queryClient } = useQueryClient();


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
  const [selectedTrait, setSelectedTrait] = useState("");
  const [snipePrice, setSnipePrice] = useState();
  
  const date = new Date();
  date.setDate(date.getDate() + 10); 

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
    "https://rpc.atlantic-2.seinetwork.io"
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
        .then((response) => console.log(response.results))
        .catch((err) => console.error(err));
    } catch (error: any) {
      console.error("Error:", error.message);
    }
  };
  useEffect(() => {
    fetchUserSnipes();
  }, []);

  const createSnipe = async () => {
    try {
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          "user_contract_address": walletAddress,
          "collection_address": collectionAddress,
          "category": 2,
          "target_price": snipePrice,
          "trait": "background:rare",
          "transfer_address": walletAddress,
          "expiry": date,
        }),
      };
      await fetch("https://app.seisaw.xyz/api/snipe/create/", options)
        .then((response) => response.json())
        .catch((err) => console.error(err));
    } catch (error: any) {
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
    }
  };
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
        console.log(data, "Line 243")
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchTraits();
  }, [selectedCollectionId])

  // console.log(collectionAddress)
  useEffect(() => {
    const fetchBalances = async () => {
      if (queryClient && walletAddress) {
        const { balances } = await queryClient.COMPASS_WALLET.bank.allBalances({ address: walletAddress });
        return balances as BalanceResponseType[];
      }
      return [];
    };

    fetchBalances().then(setWalletBalances);
  }, [offlineSigner]);
  console.log(walletBalances)

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
                    you snipe
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
                    // onClick={() =>
                    //   signingClient?.sign(
                    //     accounts[0].address,
                    //     "SeiSaw Registration",
                    //     0,
                    //     "null"
                    //   )
                    // }
                  />
                  {/*<button onClick={signMessage}>Sign</button>
            <button onClick={verifySignature}>Verify</button>*/}
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
          <div className="w-40 h-40">
            <span buttonClassName="bg-gray-200 text-gray-500 rounded-md px-2 py-1">{walletAddress}</span>
            <span className="bg-gray-200 text-gray-500 rounded-md px-2 py-1">Wallet Balance</span>
          </div>
        <main className="relative mx-4 w-full h-[660px] dark:bg-gradient-to-bl bg-gradient-to-bl from-[#F3F3F3] to-[#F8F8F8] dark:border-none border border-gray-100 drop-shadow-md">
          <div className="px-4">
            <Tabs
              aria-label="Tabs with underline"
              style="underline"
              className="border-none"
            >
              <Tabs.Item active title="Snipes" icon={TbCrosshair}>
                {/*<div
                  className="grid grid-cols-2 gap-2"
                  style={{
                    maxHeight: "620px",
                    overflowY: "auto",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
                  {snipes.length === 0 ? (
                    <span></span>
                  ) : (
                    snipes.map((snipe, index) => (
                      <SnipeCard
                        key={index}
                        collectionName={snipe.collection}
                        price={snipe.target_price}
                        name={snipe.name}
                        image="/assets/icons/twitterx.svg"
                      />
                    ))
                  )}
                </div> */}
              </Tabs.Item>
              <Tabs.Item active title="Create Snipes" icon={TbCrosshair}>
                <form className="flex gap-4">
                  <select
                    className="py-3 rounded-md"
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
                    className="py-3 rounded-md"
                    value={selectedTrait}
                    onChange={handleSelectTrait}
                  >
                    <option value="">Trait (Optional)</option>
                    {traitList  && Object.keys(traitList).map((parentTrait, parentIndex) => (
                      <option key={parentIndex} value={parentTrait}>{parentTrait}</option>
                    ))}
                  </select>
                </form>
                <div className="flex gap-8 m-2">
                  <input className="bg-gray-200 rounded-md" placeholder="   Snipe for" onChange={handleSnipePriceChange}></input>
                  <button className="px-4 py-2 bg-[#001021] rounded-md text-white hover:bg-gray-500" onClick={createSnipe}>Snipe</button>
                  <span className="w-[200px] px-4 py-2 my-2 bg-gray-100 shadow-lg rounded-md flex items-center gap-1">Floor Price: <span className="font-semibold">{collectionFloor} SEI</span></span>
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
                <div
              className="h-[480px] lg:h-[400px]"
              style={{
                overflowY: "auto",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {nfts && nfts.length > 0 ? (
                <div className="w-auto m-2">
                  <ul className="grid grid-cols-2 gap-12">
                    {nfts.map((nft) => (
                      <>
                        <li key={nft.id} className="p-2 rounded-md bg-gradient-to-tr from-[#F3F3F3] to-[#F8F8F8] shadow-lg">
                          <h2>{nft.name}</h2>
                          <img src={nft.image} alt={nft.name} />
                          <p>Rarity Rank: {nft.rarity_rank}</p>
                          <p>Rarity Score: {nft.rarity_score}</p>
                          <ul>
                            {nft.traits.map((trait) => (
                              <li key={trait.type}>
                                <strong>{trait.type}:</strong> {trait.value}
                              </li>
                            ))}
                          </ul>
                        </li>
                        {/*<div className="flex gap-4">
                          <input
                            placeholder="Snipe for"
                            className="py-2 px-4 w-[120px]"
                            onChange={handleTargetPrice}
                          ></input>
                          <button
                            className="px-4 py-2 bg-[#001021] text-white rounded-md"
                            onClick={() => createSnipe(nft.id)}
                          >
                            Snipe
                          </button>
                        </div>*/}
                      </>
                    ))}
                  </ul>
                </div>
              ) : (
                <p>Loading...</p>
              )}
            </div>
              </Tabs.Item>
            </Tabs>
            {/* <div
              className=""
              style={{
                maxHeight: "400px",
                overflowY: "auto",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {nfts && nfts.length > 0 ? (
                <div className="w-[300px] shadow-lg m-4 p-4">
                  <ul className="">
                    {nfts.map((nft) => (
                      <>
                        <li key={nft.id}>
                          <h2>{nft.name}</h2>
                          <img src={nft.image} alt={nft.name} />
                          <p>Rarity Rank: {nft.rarity_rank}</p>
                          <p>Rarity Score: {nft.rarity_score}</p>
                          <ul>
                            {nft.traits.map((trait) => (
                              <li key={trait.type}>
                                <strong>{trait.type}:</strong> {trait.value}
                              </li>
                            ))}
                          </ul>
                        </li>
                        <div className="flex gap-4">
                          <input
                            placeholder="Snipe for"
                            className="py-2 px-4 w-[120px]"
                            onChange={handleTargetPrice}
                          ></input>
                          <button
                            className="px-4 py-2 bg-[#001021] text-white rounded-md"
                            onClick={() => createSnipe(nft.id)}
                          >
                            Snipe
                          </button>
                        </div>
                      </>
                    ))}
                  </ul>
                </div>
              ) : (
                <p>Loading...</p>
              )}
            </div> */}
          </div>
        </main>
        </>
      )}
    </>
  );
};

export default Connect;
