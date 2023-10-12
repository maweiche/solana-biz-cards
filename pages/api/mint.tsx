import { NextApiRequest, NextApiResponse } from "next";
import { Helius } from "helius-sdk";
import { v4 as uuidv4 } from "uuid";

export type MakeTransactionInputData = {
  account: string;
};

export type MakeTransactionOutputData = {
  transaction: string;
  message: string;
};

async function post(req: NextApiRequest, res: NextApiResponse) {
  //Handle POST requests to issue a coupon
  if (req.method === "POST") {
    try {
      const fs = require("fs");
      const sharp = require("sharp");
      const fileName = uuidv4();
      const { image, firstName, lastName, jobTitle, email, phone, website, airdropTo, creatorAddress } = req.body;
      
      fs.writeFileSync(`uploads/${fileName}.svg`, image);

      await sharp(`uploads/${fileName}.svg`)
        .png()
        .toFile(`uploads/${fileName}.png`)
        // @ts-ignore
        .then(function (info) {
          console.log("sharp info", info);
        })
        // @ts-ignore
        .catch(function (err) {
          console.log("sharp err", err);
        });

      async function run() {
        const helius = new Helius(process.env.NEXT_PUBLIC_HELIUS_KEY!);
        const response = await helius.mintCompressedNft({
          name: "Business Card",
          symbol: "swissDAO",
          owner: airdropTo,
          description: "A business card courtesy of swissDAO",
          attributes: [
            {
              trait_type: "Name",
              value: `${firstName} ${lastName}`,
            },
            {
              trait_type: "Job Title",
              value: jobTitle,
            },
            {
              trait_type: "Email",
              value: email,
            },
            {
              trait_type: "Phone",
              value: phone,
            },
            {
              trait_type: "Website",
              value: website,
            },
            {
              trait_type: "Creator Address",
              value: creatorAddress,
            },
          ],
          externalUrl: "https://www.swissDAO.space",
          imagePath: `/Users/matt/Desktop/swissDAO_Github/solana-biz-cards/uploads/${fileName}.png`,
          walletPrivateKey: process.env.NEXT_PUBLIC_WALLET_PRIVATE_KEY!,
        });

        console.log(response);
        return response;
      }
      const response = await run();


      console.log("\nSuccessfully minted the compressed NFT!");
      //   return status: success and the txSignature
      return res.status(200).json({
        status: "success",
        signature: response.result.signature
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "error" });
    }
  }
}

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  } else if (req.method === "POST") {
    return await post(req, res);
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}

export default async function GET(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  } else if (req.method === "POST") {
    return await post(req, res);
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
