"use client";
import { useState, useMemo, useEffect } from "react";
import { Combobox } from "@headlessui/react";
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
import useWalletStore from "@/store/useWalletStore";
import { Copy } from "lucide-react"

type BalanceResponseType = {
  amount: string;
  denom: string;
};

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function Home() {
  const user_id = "";
  const rpcUrl = "https://sei-rpc.polkachu.com";
  const restUrl = "https://sei-api.polkachu.com";
  const chainId = "pacific-1";

  const { walletAddress, botWallet, mainWalletBalance } = useWalletStore();
  const [botBalance, setBotBalance] = useState();

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

  if (!isLoading) {
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

  const copy = async () => {
    await navigator.clipboard.writeText(botWallet);
  }

  useEffect(() => {
    const fetchBalances = async () => {
      if (queryClient && botWallet) {
        const { balances } = await queryClient.cosmos.bank.v1beta1.allBalances({ address: botWallet });
        return balances as BalanceResponseType[];
      }
      return [];
    };
    fetchBalances().then(setBotBalance);
  }, [offlineSigner]);

  return (
    <SeiWalletProvider
      chainConfiguration={{ chainId, restUrl, rpcUrl }}
      wallets={["compass", "keplr", "leap"]}
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

          {walletAddress && (
            <div className="absolute flex flex-col gap-1 bg-gray-200 p-2 m-2 rounded-md">
              <button className="flex flex-col text-sm lg:text-md px-1">Main Wallet:<span>{walletAddress.slice(-5)}</span></button>
              <span className="flex flex-col rounded-md text-sm lg:text-md px-1 py-1">Wallet Balance: <span>{botBalance}</span></span>
            </div>)}
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
          {botWallet && (
            <div className="flex justify-center gap-2">
              <span className="bg-gray-200 p-2 rounded-md">Bot Wallet: {botWallet.slice(-5)}</span>
              <button onClick={copy} disabled={!botWallet} className="text-gray-500 bg-white p-1 rounded-md"><Copy /></button>
            </div>)}

          <div className="flex justify-center drop-shadow-xl">
            <Connect />
          </div>
          <div className="absolute w-full bottom-14 lg:bottom-20 flex justify-center">
            <span className="text-center flex gap-1 items-center">Powered by SeiBots<Image src={seibots} width={32} height={32} alt="🤖" /></span>
          </div>
          <div className="absolute flex justify-center bottom-4 w-full">
            <SMContainer />
          </div>
        </main>
      </div>
    </SeiWalletProvider>
  );
}
