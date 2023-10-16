import { NextApiRequest, NextApiResponse } from "next";
import { Helius } from "helius-sdk";
import { v4 as uuidv4 } from "uuid";
import Irys from "@irys/sdk";
import { WrapperConnection } from "../../ReadApi/WrapperConnection";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  clusterApiUrl,
  PublicKey,
} from "@solana/web3.js";

export type MakeTransactionInputData = {
  account: string;
};

export type MakeTransactionOutputData = {
  transaction: string;
  message: string;
};
const sharp = require("sharp");
async function post(req: NextApiRequest, res: NextApiResponse) {
  //Handle POST requests to issue a coupon
  if (req.method === "POST") {
    try {
      console.log('triggered')
      const fs = require("fs");
      
      const fileName = uuidv4();
      console.log('wtff')
      const privateKeySecret = process.env.NEXT_PUBLIC_WALLET_PRIVATE_KEY;
      console.log('grabbed private key')
      // const keyfileBytes = await JSON.parse(privateKeySecret!);
      // // parse the loaded secretKey into a valid keypair
      // const payer = Keypair.fromSecretKey(Uint8Array.from(keyfileBytes!));
      // console.log('payer', payer.publicKey.toBase58())
      const CLUSTER_URL = process.env.RPC_URL || clusterApiUrl("mainnet-beta"); // provide a default value for RPC_URL
      // create a new rpc connection, using the ReadApi wrapper
      const connection = new WrapperConnection(CLUSTER_URL, "confirmed");
      // const METAPLEX = Metaplex.make(connection)
      //   .use(keypairIdentity(payer))
      //   .use(
      //     bundlrStorage({
      //       address: "https://devnet.bundlr.network",
      //       providerUrl: CLUSTER_URL,
      //       timeout: 60000,
      //     }),
      //   );

      
      const { image, firstName, lastName, jobTitle, email, phone, website, airdropTo, creatorAddress } = req.body;
      // create tmp directory to write to on production
      // if (!fs.existsSync("uploads")) {
      //   fs.mkdirSync("uploads");
      // }

      
      // // write the svg to the tmp directory
      // fs.writeFileSync(`/tmp/${fileName}.svg`, image);

      // await sharp(`/tmp/${fileName}.svg`)
      //   .png()
      //   .resize(500, 500)
      //   .toFile(
      //     `/tmp/${fileName}.png`,
      //   )
      //   // @ts-ignore
      //   .then(function (info) {
      //     console.log("sharp info", info);
      //     // console log image size in megabytes
      //     console.log(
      //       "sharp info size",
      //       info.size / 1000000 + "MB",
      //     );
      //   })
      //   // @ts-ignore
      //   .catch(function (err) {
      //     console.log("sharp err", err);
      //   });
      const getIrys = async () => {
        const url = "https://node1.irys.xyz";
        const providerUrl = CLUSTER_URL;
        const token = "solana";
        const privateKey = privateKeySecret;
        
        const irys = new Irys({
          url, // URL of the node you want to connect to
          token, // Token used for payment
          key: privateKey, // ETH or SOL private key
          // config: { providerUrl: providerUrl }, // Optional provider URL, only required when using Devnet
        });
        console.log('connection made')
        return irys;
      };

      // async function uploadImage(): Promise<string> {
      //   console.log(`Step 1 - Uploading Image`);
      //   const imgUri = await METAPLEX.storage().upload(image);
      //   console.log(`   Image URI:`, imgUri);
      //   return imgUri;
      // }

      const uploadImage = async () => {
        const irys = await getIrys();
        // console.log('irys', irys)
        // write the image to the vercel tmp directory
        fs.writeFileSync(`/tmp/${fileName}.svg`, image);
        console.log('wrote svg file')
        // convert the svg to png with sharp
        await sharp(
          `/tmp/${fileName}.svg`
        )
          .resize(500, 500)
          .png()
          .toFile(`/tmp/${fileName}.png`)
          // @ts-ignore
          .then((data) => 
            console.log('data', data)
          )
          // @ts-ignore
          .catch((err) => console.log(err));
     
        const fileToUpload = `/tmp/${fileName}.png`;
        const token = "solana";
        // Get size of file
        const { size } = await fs.promises.stat(fileToUpload);
        // Get cost to upload "size" bytes
        const price = await irys.getPrice(size);
        console.log(`Uploading ${size} bytes costs ${irys.utils.fromAtomic(price)} ${token}`);
        // Fund the node
        await irys.fund(price);
       
        // Upload metadata
        try {
          const response = await irys.uploadFile(fileToUpload);
          
          console.log(`File uploaded ==> https://gateway.irys.xyz/${response.id}`);
          return `https://gateway.irys.xyz/${response.id}`;
        } catch (e) {
          console.log("Error uploading file ", e);
        }
      };

      // const imgUri = await uploadImage();
      // const imgUri = 'https://arweave.net/dCcyTFef-Usa4yDaWaSysVJSX_kVnV2YWOsp3Q0XrKU'

      // console.log("imgUri", imgUri);

      const image_url = await uploadImage();

    
        const helius = new Helius(process.env.NEXT_PUBLIC_HELIUS_KEY!);
        helius.mintCompressedNft({
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
          imageUrl: image_url,
        }).then(() => {
          console.log("Successfully minted the compressed NFT!");
        });
          



      console.log("\nSuccessfully minted the compressed NFT!");
      //   return status: success and the txSignature
      return res.status(200).json({
        status: "success",
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
