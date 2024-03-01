"use client"

import { SeiWalletProvider } from "@sei-js/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { COMPASS_WALLET, getQueryClient } from "@sei-js/core";
import axios from 'axios';
import { Combobox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";


const rpcUrl = 'https://rpc.atlantic-2.seinetwork.io';
const restUrl = 'https://rest.atlantic-2.seinetwork.io/';
const chainId = "atlantic-2";

export default function App() {

    const [wallet, setWallet] = useState(false) as any;
    const [accounts, setAccounts] = useState([]) as any;
    const [balance, setBalance] = useState("");

    useEffect(() => {
        checkBalance();
    }, [wallet])


    const connect = async () => {
        try {
            await COMPASS_WALLET.connect(chainId);
            const accounts = await COMPASS_WALLET.getAccounts(chainId);

            if (accounts[0]) {
                setWallet(accounts[0].address)
                setAccounts(accounts)
            }
        }
        catch (e) {
            console.log(e)
            alert('Please install compass wallet')
        }
    }

    //change wallet
    const handleChange = (event: any) => {
        setWallet(event.target.value);
    };

    //check balance
    const checkBalance = async () => {
        if (!wallet) return;
        try {
            const { data } = await axios.get('https://rest.atlantic-2.seinetwork.io/cosmos/bank/v1beta1/balances/' + wallet)
            console.log('Balance', data)

            const balance = data.balances.find((balance: any) => balance.denom === "usei");

            setBalance(balance ? balance.amount : 0)
        }
        catch (e) {
            console.log(e)
        }
    }

    return (
        <SeiWalletProvider chainConfiguration={{ chainId, restUrl, rpcUrl }} wallets={["compass"]}>


            <div className="flex items-center justify-center h-screen bg-gray-50">
                {!wallet &&
                    <div className="max-w-md w-full h-full flex flex-col px-6 py-8 *: bg-white justify-center items-center shadow-md">
                        <h2 className="text-2xl font-semibold text-center text-indigo-500 mt-auto">
                            Sei Bots
                        </h2>
                        <div className="flex justify-center items-center  align-middle mt-5">
                            <Image src="/compass.png" alt="compass" width={50} height={50} />
                            <p className="ml-2 text-sm text-center text-gray-600 flex">
                                Get started by connectiong your wallet.
                            </p>
                        </div>
                        <div className="mt-6">

                            <button
                                onClick={connect}
                                className="w-full px-4 py-2 mt-4 font-semibold text-white bg-indigo-500 my-10 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
                            >
                                Connect Wallet
                            </button>

                        </div>
                        <p className="mt-2 text-sm text-center text-gray-600 mb-10">
                            Compass wallet should be installed. To install compass wallet:&nbsp;
                            <a href="https://compasswallet.io/">
                                Install Compass wallet.
                            </a>
                        </p>

                    </div>
                }
                {wallet &&
                    <div className="h-screen w-screen p-10 bg-gray-50">

                        <div className="container-lg h-screen w-full rounded-sm p-10 bg-white">
                            <div className="my-4">
                                <label className="block text-sm font-medium text-gray-700" htmlFor="wallet">
                                    Connected Wallet: Balance {balance}
                                </label>
                                <select
                                    value={wallet}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-200 rounded-lg focus:outline-none" id="wallet" required
                                >
                                    {accounts.map((option: any, index: any) => (
                                        <option key={index} value={option.address}>
                                            {option.address}
                                        </option>
                                    ))}
                                </select>
                            </div>



                            <div className="container mx-auto w-1/2">
                                <div className="flex flex-col items-center justify-center gap-">
                                    <div>Snipe</div>


                                </div>


                            </div>

                        </div>
                    </div>
                }
            </div>




        </SeiWalletProvider>
    )
}