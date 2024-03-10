import { create } from "zustand";

interface WalletState {
  walletAddress: string;
  updateWalletAddress: (newAddress: string) => void;
}

const useWalletStore = create<WalletState>()((set) => ({
  walletAddress: "",
  updateWalletAddress: (newAddress) => set({ walletAddress: newAddress }),
}));

export default useWalletStore;
