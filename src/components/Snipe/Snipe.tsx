"use client";
import { useState, useEffect } from "react";
import { SeiWalletProvider } from "@sei-js/react";
import { useWallet, WalletConnectButton, useQueryClient } from "@sei-js/react";
import { ThemeSwitch } from "../../components/ThemeSwitch";
import Image from "next/image";
import SMContainer from "../../components/SociaMediaContainer/SMContainer";
import logo from "../../../public/logo/seisaw.jpeg";
import { LogOut } from "lucide-react";

import useWalletStore from "@/store/useWalletStore";

const Snipe = () => {
  const { offlineSigner, connectedWallet, accounts } = useWallet();
  const { walletAddress, updateWalletAddress } = useWalletStore();

  return (
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
            />
          </div>
          <br />
          <div></div>
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
  );
};

export default Snipe;
