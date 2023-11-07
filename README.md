# Project Title

Solana Business Card Compressed NFT

## Description

Create a dynamic Business Card NFT that can be used to share contact information and social media links. The image for the cNFT will be generated from an in-browser SVG that is then converted to a PNG on the backend and uploaded to Irys using Vercel's `/temp` directory, therefore no database is needed to store the image. The NFT will be compressed to reduce the size of the NFT and reduce the cost of minting the NFT. The NFT will be minted using Helius' easy `mintCompressedNft` API endpoint. The cNFT can be airdropped to any Solana wallet address or .SOL domain.

## Installation

Begin by cloning the repo and installing dependencies:

```
npm install
```

Replace the values inside the `example.env` with your credentials and rename the file to `.env`

## Usage

The app can be run locally using the following command:

```
npm run dev
```

In order to mint the cNFT a template must be selected and the form must include a valid Solana Wallet address or .SOL domain.

The `gallery` will parse and display all cNFTs that have `NEXT_PUBLIC_WALLET_ADDRESS` listed as a `creator`.

## License

[GNU Affero General Public License v3.0](https://choosealicense.com/licenses/agpl-3.0/#)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
