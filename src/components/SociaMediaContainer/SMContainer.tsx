import React from "react";
import Image from "next/image";
import twitter from "../../../public/assets/icons/twitterx.svg";
import twitterWhite from "../../../public/assets/icons/twitterx-white.svg";
import discord from "../../../public/assets/icons/discord.svg";
import discordWhite from "../../../public/assets/icons/discord-white.svg";
import Link from "next/link";
import { useTheme } from "next-themes";

const SMContainer = ({ ...props }) => {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className="w-32 bottom-0 px-2 py-2 rounded-full flex justify-center gap-4 dark:bg-gradient-to-br bg-gradient-to-br from-[#f5f5f5] to-[#f7f7f7] drop-shadow-lg dark:bg-red-500"
      {...props}
    >
      {theme === "dark" && (
        <Link href="#">
          <Image src={twitterWhite} width={24} height={24} alt="Twitter" />
        </Link>
      )}
      {theme !== "dark" && (
        <Link href="#">
          <Image src={twitter} width={24} height={24} alt="Twitter" />
        </Link>
      )}
      <span className="border border-gray-200 w-0 drop-shadow-sm rounded-md"></span>
      {theme === "dark" && <Link href="#">
        <Image src={discordWhite} width={24} height={24} alt="Discord" />
      </Link>}
      {theme !== "dark" && <Link href="#">
        <Image src={discord} width={24} height={24} alt="Discord" />
      </Link>}
    </div>
  );
};

export default SMContainer;
