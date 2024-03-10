import React, { ReactNode, ButtonHTMLAttributes } from "react";
import Link from "next/link";

interface NeuButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  Text?: string;
  Redirect: string;
  LucideIcon?: ReactNode;
  customWalletButton?: ReactNode; 
}

const NeuButton: React.FC<NeuButtonProps> = ({
  Text,
  Redirect,
  LucideIcon,
  customWalletButton,
  ...props
}) => {
  return (
    <>
      <Link href={Redirect}>
        <button
          className="px-6 py-3 rounded-full text-white flex gap-1 bg-gradient-to-br from-sky-600 to-sky-400 hover:bg-gradient-to-br hover:from-emerald-400 hover:to-emerald-500 drop-shadow-lg"
          {...props}
        >
          {Text} {customWalletButton}
          {LucideIcon}
        </button>
      </Link>
    </>
  );
};

export default NeuButton;
