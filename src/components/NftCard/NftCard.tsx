import React from "react";
import Image from "next/image";

type Trait = {
  type: string;
  value: string;
};

type Nft = {
  id: string;
  nft_id: string;
  name: string;
  owner: string;
  image: string;
  hidden: boolean;
  last_sale: any;
  version: string;
  rarity_rank: number;
  rarity_score: string;
  traits: Trait[];
  price: number | null;
  metadata: any;
  created_at: string;
  updated_at: string;
  collection: string;
};

type Props = {
  nfts: Nft[];
};

const NftCard = ({ nfts }: Props) => {
  return (
    <div>
      {nfts.map((nft) => (
        <div
          key={nft.id}
          className="lg:w-[360px] py-4 bg-white dark:bg-gray-700 rounded-md shadow-md overflow-hidden mb-4"
        >
          <div className="flex justify-center">
            <Image src={nft.image} width={300} height={300} alt={nft.name} />
          </div>
          <div className="flex flex-col px-8">
            <span>{nft.name}</span>
            <span>Owner: {nft.owner}</span>
            {nft.price && <span>Price: {nft.price}</span>}
            <span>Collection: {nft.collection}</span>
            <span>Rarity Rank: {nft.rarity_rank}</span>
            <span>Rarity Score: {nft.rarity_score}</span>
            <span>Created At: {nft.created_at}</span>
            <span>Updated At: {nft.updated_at}</span>
            <ul>
              {nft.traits.map((trait, index) => (
                <li key={index}>
                  <strong>{trait.type}:</strong> {trait.value}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NftCard;
