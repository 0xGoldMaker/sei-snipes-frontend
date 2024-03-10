import Image from "next/image";
import React from "react";

type Props = {
  image: string;
  name: string;
  price?: number;
  collectionName: string;
};

const SnipeCard = (props: Props) => {
  const { image, name, price, collectionName} = props;

  return (
    <div>
      <div className="lg:w-[360px] py-4 bg-white dark:bg-gray-700 rounded-md shadow-md overflow-hidden">
        <div className="flex justify-center">
        <Image src={image} width={300} height={300} alt={name} />
        </div>
        <div className="flex flex-col px-8">
          <span>{name}</span>
          <span>{price}</span>
          <span>{collectionName}</span>
        </div>
      </div>
    </div>
  );
};

export default SnipeCard;
