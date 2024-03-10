"use client";
import { useState, useEffect } from "react";
import { SeiWalletProvider } from "@sei-js/react";
import { useWallet, WalletConnectButton, useQueryClient } from "@sei-js/react";
import { ThemeSwitch } from "../../components/ThemeSwitch";
import Image from "next/image";
import SMContainer from "../../components/SociaMediaContainer/SMContainer";
import logo from "../../../public/logo/seisaw.jpeg";
import { LogOut } from "lucide-react";
import { Tabs } from "flowbite-react";
import { TbCrosshair } from "react-icons/tb";
import { useSigningClient } from "@sei-js/react";

import useWalletStore from "@/store/useWalletStore";
import SnipeCard from "@/components/SnipeCard/SnipeCard";

const page = () => {
  const rpcUrl = "https://rpc.atlantic-2.seinetwork.io";
  const restUrl = "https://rest.atlantic-2.seinetwork.io";
  const chainId = "atlantic-2";
  const { offlineSigner, connectedWallet, accounts } = useWallet();
  const [data, setData] = useState(null);
  const { walletAddress, updateWalletAddress } = useWalletStore();
  const { signingClient, isLoading } = useSigningClient(
    "https://rpc.atlantic-2.seinetwork.io"
  );

  const [collectionNameList, setCollectionNameList] = useState([]);

  const [snipes, setSnipes] = useState([]);
  const [collectionList, setCollectionList] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState("");
  const [nftCollection, setNftCollection] = useState([]);
  const [collectionId, setCollectionId] = useState("");

  
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
          setSnipes(data.results); // Update state with fetched snipes
          // Extract collections and store them in collectionList
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
          // Extract collection names
          const collectionNames = data.results.map(
            (collection: any) => collection.name
          );
          const collectionId = data.results.map(
            (collection: any) => collection.id
          )
          // Update collectionList state with collection names
          setCollectionNameList(collectionNames);
          setCollectionId(collectionId)
        })
        .catch((err) => console.error(err));
    } catch (error: any) {
      console.error("Error:", error.message);
    }
  }, []);
  console.log(collectionId)
  

  const handleSelectCollection = (event: any) => {
      setSelectedCollection(event.target.value);
  };

  useEffect(() => {
    try {
      const options = {
        method: "GET",
        headers: { "User-Agent": "insomnia/8.6.1" },
      };
      fetch(
        `https://app.seisaw.xyz/api/nfts/?collection=${collectionId}`,
        options
      )
        .then((response) => response.json())
        .then((data) => {
          const nfts = data.results.map((nftC: any) => nftC.collection);
          setNftCollection(nfts);
          console.log(data)
        })
        .catch((err) => console.error(err));
    } catch (error: any) {
      console.error("Error:", error.message);
    }
  }, [collectionId]);

  return (
    <SeiWalletProvider
      chainConfiguration={{ chainId, restUrl, rpcUrl }}
      wallets={["compass"]}
    >
      <div>
        <div className="flex items-center justify-center h-screen">
          <main className="relative w-full lg:w-[40%] h-[100vh] dark:bg-gradient-to-bl bg-gradient-to-bl from-[#F3F3F3] to-[#F8F8F8] dark:border-none border border-gray-100 drop-shadow-md">
            <div className="absolute right-4 top-4 cursor-pointer mt-4">
              <div className="flex gap-4">
                <span>{walletAddress}</span>
                <ThemeSwitch />
                <LogOut />
              </div>
            </div>
            <div className="flex justify-center mt-8">
              <Image
                src={logo}
                width={100}
                height={40}
                alt="SeiSaw Logo"
                className="absolute left-4 shadow-xl drop-shadow-xl"
                // onClick={fetchCollectionList}
              />
            </div>
            <br />
            <div className="px-4 mt-8 ">
              <Tabs
                aria-label="Tabs with underline"
                style="underline"
                className="border-none"
              >
                <Tabs.Item active title="Snipes" icon={TbCrosshair}>
                  <div
                    className="grid grid-cols-2 gap-2"
                    style={{
                      maxHeight: "620px",
                      overflowY: "auto",
                      scrollbarWidth: "none",
                      msOverflowStyle: "none",
                    }}
                  >
                    {snipes.length === 0 ? (
                      <span>No snipes Found</span>
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
                  </div>
                </Tabs.Item>
                <Tabs.Item active title="Create Snipes" icon={TbCrosshair}>
                  <form className="">
                    <select
                      className="py-3 rounded-md"
                      value={selectedCollection}
                      onChange={handleSelectCollection}
                    >
                      <option value="">All Collections</option>
                      {collectionNameList.map((collection, index) => (
                        <option key={index} value={collection}>
                          {collection}
                        </option>
                      ))}
                    </select>
                  </form>
                  <div
                    className="grid grid-cols-2 gap-2"
                    style={{
                      maxHeight: "400px",
                      overflowY: "auto",
                      scrollbarWidth: "none",
                      msOverflowStyle: "none",
                    }}
                  >
                    {snipes.length === 0 ? (
                      <span>No snipes Found</span>
                    ) : (
                      snipes
                        .filter(
                          (snipe) =>
                            selectedCollection === "" ||
                            snipe.collection === selectedCollection
                        )
                        .map((snipe, index) => (
                          <SnipeCard
                            key={index}
                            collectionName={snipe.collection}
                            price={snipe.target_price}
                            name={snipe.name}
                            image="/assets/icons/twitterx.svg"
                          />
                        ))
                    )}
                  </div>
                </Tabs.Item>
              </Tabs>
            </div>
            <br />
            <div className="absolute w-full bottom-24 flex justify-center">
              <span className="text-center">Powered by SeiBots🤖</span>
            </div>
            <div className="absolute flex justify-center bottom-4 w-full">
              <SMContainer />
            </div>
          </main>
        </div>
      </div>
    </SeiWalletProvider>
  );
};

export default page;
