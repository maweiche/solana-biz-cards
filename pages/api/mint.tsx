import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import Irys from "@irys/sdk";
export type MakeTransactionInputData = {
  account: string;
};

export type MakeTransactionOutputData = {
  transaction: string;
  message: string;
};
const sharp = require("sharp");
const fs = require("fs");

async function post(req: NextApiRequest, res: NextApiResponse) {
  //Handle POST requests to issue a coupon
  if (req.method === "POST") {
    try {
      const fileName = uuidv4();
      const privateKeySecret = process.env.NEXT_PUBLIC_WALLET_PRIVATE_KEY;
      const {
        image,
        firstName,
        lastName,
        jobTitle,
        email,
        phone,
        twitter,
        telegram,
        website,
        airdropTo,
        creatorAddress,
      } = req.body;

      const getIrys = async () => {
        const url = "https://node1.irys.xyz";
        const token = "solana";
        const privateKey = privateKeySecret;

        const irys = new Irys({
          url, // URL of the node you want to connect to
          token, // Token used for payment
          key: privateKey, //SOL private key in base58 format
          // config: { providerUrl: providerUrl }, // Optional provider URL, only required when using Devnet
        });
        return irys;
      };

      const uploadImage = async () => {
        const irys = await getIrys();
        // console.log('irys', irys)
        // write the image to the vercel tmp directory
        fs.writeFileSync(`/tmp/${fileName}.svg`, image);
        console.log("wrote svg file");
        // convert the svg to png with sharp
        await sharp(`/tmp/${fileName}.svg`)
          .resize(500, 500)
          .png()
          .toFile(`/tmp/${fileName}.png`)
          // @ts-ignore
          .then((data) => console.log("data", data))
          // @ts-ignore
          .catch((err) => console.log(err));

        const fileToUpload = `/tmp/${fileName}.png`;
        const token = "solana";
        // Get size of file
        const { size } = await fs.promises.stat(fileToUpload);
        // Get cost to upload "size" bytes
        const price = await irys.getPrice(size);
        console.log(
          `Uploading ${size} bytes costs ${irys.utils.fromAtomic(
            price,
          )} ${token}`,
        );
        // Fund the node
        await irys.fund(price);

        // Upload metadata
        try {
          const response = await irys.uploadFile(fileToUpload);

          console.log(
            `File uploaded ==> https://gateway.irys.xyz/${response.id}`,
          );
          return `https://gateway.irys.xyz/${response.id}`;
        } catch (e) {
          console.log("Error uploading file ", e);
        }
      };
      const image_url = await uploadImage();
      const url = process.env.NEXT_PUBLIC_RPC_URL!;
      const mintCompressedNft = async () => {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: "helius-test",
            method: "mintCompressedNft",
            params: {
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
                  value: email || "",
                },
                {
                  trait_type: "Phone",
                  value: phone || "",
                },
                {
                  trait_type: "Twitter",
                  value: twitter || "",
                },
                {
                  trait_type: "Telegram",
                  value: telegram || "",
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
              imageUrl: image_url,
              externalUrl: "https://www.swissDAO.space",
              sellerFeeBasisPoints: 6900,
              creators: [
                {
                  address: "4Rsq3eYnZ6ySCLyRdvV7dRkoL2a5VdNstz3RrtsWvQeE",
                  share: 100,
                },
              ],
            },
          }),
        });
        const { result } = await response.json();
        console.log("result", result);
        console.log("Minted asset: ", result.assetId);

        return result;
      };

      const response = await mintCompressedNft();
      return res.status(200).json({
        status: "success",
        assetId: response.assetId,
        transaction: response.transaction,
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
