import { create } from "zustand";

interface WalletState {
  walletAddress: string;
  updateWalletAddress: (newAddress: string) => void;
  botWallet: string;
  updateBotWallet: (newBotAddress: string) => void;
  mainWalletBalance: number;
  updateMainWalletBalance: (newMainWalletBalance: number) => void;


}

const useWalletStore = create<WalletState>()((set) => ({
  walletAddress: "",
  updateWalletAddress: (newAddress) => set({ walletAddress: newAddress }),
  botWallet: "",
  updateBotWallet: (newBotAddress) => set({ botWallet: newBotAddress }),
  mainWalletBalance: 0,
  updateMainWalletBalance: (newMainWalletBalance) => set({mainWalletBalance: newMainWalletBalance})

}));

export default useWalletStore;
