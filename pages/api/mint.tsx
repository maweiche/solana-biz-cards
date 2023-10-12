import { NextApiRequest, NextApiResponse } from "next";
import { Helius } from "helius-sdk";
import { v4 as uuidv4 } from "uuid";
import { WrapperConnection } from "../../ReadApi/WrapperConnection";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  clusterApiUrl,
  PublicKey,
} from "@solana/web3.js";
// import {
//   loadKeypairFromFile,
//   loadOrGenerateKeypair,
//   numberFormatter,
//   printConsoleSeparator,
//   savePublicKeyToFile,
// } from "@/utils/helpers";
import {
  Metaplex,
  keypairIdentity,
  bundlrStorage,
  toMetaplexFile,
} from "@metaplex-foundation/js";

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
      console.log('triggered')
      const fs = require("fs");
      const sharp = require("sharp");
      const fileName = uuidv4();
      console.log('wtff')
      const privateKey = process.env.NEXT_PUBLIC_WALLET_PRIVATE_KEY;
      console.log('grabbed private key')
      const keyfileBytes = await JSON.parse(privateKey!);
      // // parse the loaded secretKey into a valid keypair
      const payer = Keypair.fromSecretKey(Uint8Array.from(keyfileBytes!));
      console.log('payer', payer.publicKey.toBase58())
      const CLUSTER_URL = process.env.RPC_URL || clusterApiUrl("mainnet-beta"); // provide a default value for RPC_URL
      // create a new rpc connection, using the ReadApi wrapper
      const connection = new WrapperConnection(CLUSTER_URL, "confirmed");
      const METAPLEX = Metaplex.make(connection)
        .use(keypairIdentity(payer))
        .use(
          bundlrStorage({
            address: "https://node1.irys.xyz",
            providerUrl: CLUSTER_URL,
            timeout: 60000,
          }),
        );

      console.log('connection made')
      const { image, firstName, lastName, jobTitle, email, phone, website, airdropTo, creatorAddress } = req.body;
      // create tmp directory to write to on production
      if (!fs.existsSync("uploads")) {
        fs.mkdirSync("uploads");
      }

      
      // write the svg to the tmp directory
      fs.writeFileSync(`/tmp/${fileName}.svg`, image);

      await sharp(`/tmp/${fileName}.svg`)
        .png()
        .resize(500, 500)
        .toFile(
          `/tmp/${fileName}.png`,
        )
        // @ts-ignore
        .then(function (info) {
          console.log("sharp info", info);
          // console log image size in megabytes
          console.log(
            "sharp info size",
            info.size / 1000000 + "MB",
          );
        })
        // @ts-ignore
        .catch(function (err) {
          console.log("sharp err", err);
        });

      async function uploadImage() {
        const imgBuffer = fs.readFileSync(`/tmp/${fileName}.png`);
        const imgMetaplexFile = toMetaplexFile(imgBuffer, fileName);

        const imgUri = await METAPLEX.storage().upload(imgMetaplexFile);
        console.log(`   Image URI:`, imgUri);

        return imgUri;
      }

      const imageURL = await uploadImage();

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
          imageUrl: imageURL,
        });

        console.log(response);
        return response;
      }
      const response = await run();


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
