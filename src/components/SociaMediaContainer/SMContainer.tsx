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
      className="w-40 bottom-0 px-6 py-3 rounded-full flex justify-center gap-4 dark:bg-gradient-to-br bg-gradient-to-br from-[#f5f5f5] to-[#f7f7f7] drop-shadow-lg"
      {...props}
    >
      {theme === "dark" && (
        <Link href="#">
          <Image src={twitterWhite} width={32} height={32} alt="Twitter" />
        </Link>
      )}
      {theme !== "dark" && (
        <Link href="#">
          <Image src={twitter} width={32} height={32} alt="Twitter" />
        </Link>
      )}
      <span className="border border-gray-200 w-0 drop-shadow-sm rounded-md"></span>
      {theme === "dark" && <Link href="#">
        <Image src={discordWhite} width={32} height={32} alt="Discord" />
      </Link>}
      {theme !== "dark" && <Link href="#">
        <Image src={discord} width={32} height={32} alt="Discord" />
      </Link>}
    </div>
  );
};

export default SMContainer;
