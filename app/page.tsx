"use client";
import { useState } from "react";
import {
  Metaplex,
  keypairIdentity,
  bundlrStorage,
  toMetaplexFile,
} from "@metaplex-foundation/js";
import { WrapperConnection } from "../ReadApi/WrapperConnection";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  clusterApiUrl,
  PublicKey,
} from "@solana/web3.js";
const Page: React.FC = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [jobTitle, setJobTitle] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [website, setWebsite] = useState<string>("");
  const [airdropTo, setAirdropTo] = useState<string>("");
  const [creatorAddress, setCreatorAddress] = useState<string>("");
  const privateKeySecret = process.env.NEXT_PUBLIC_WALLET_PRIVATE_KEY;
  // const keyfileBytes = JSON.parse(privateKey!);
  // // parse the loaded secretKey into a valid keypair
  // const payer = Keypair.fromSecretKey(Uint8Array.from(keyfileBytes!));
  const CLUSTER_URL = "https://api.mainnet-beta.solana.com"; // provide a default value for RPC_URL
  // create a new rpc connection, using the ReadApi wrapper
  const connection = new WrapperConnection(CLUSTER_URL, "confirmed");
  // const METAPLEX = Metaplex.make(connection)
  //   .use(keypairIdentity(payer))
  //   .use(
  //     bundlrStorage({
  //       address: "https://node1.irys.xyz",
  //       providerUrl: CLUSTER_URL,
  //       timeout: 60000,
  //     }),
  //   );
  async function uploadImage() {
    try {
      const image = document.getElementById("svg-container");
      // convert image into a svg string
      const svg = new XMLSerializer().serializeToString(image!);

      return svg;
    } catch (e) {
      console.log("error uploading image", e);
    }
  }

  async function convertAndSubmit() {
    const image = document.getElementById("svg-container");
    // convert image into a svg string
    const svg = new XMLSerializer().serializeToString(image!);

    const image_file = await uploadImage();
    console.log("minting business card");

    const res = await fetch("/api/mint", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: image_file,
        firstName: firstName,
        lastName: lastName,
        jobTitle: jobTitle,
        email: email,
        phone: phone,
        website: website,
        airdropTo: airdropTo,
        creatorAddress: creatorAddress,
      }),
    });

    const response_status = res.status;
    const res_text = await JSON.parse(await res.text());
    console.log("res_text", res_text);
    const asset_id = res_text.assetId;
    console.log("asset_id", asset_id);
    const xray_url = `https://xray.helius.xyz/token/${asset_id}?network=mainnet`;
    // airdrop to addy: 7wK3jPMYjpZHZAghjersW6hBNMgi9VAGr75AhYRqR2n
    // airdrop from addy: HZxkqBTnXtAYoFTg2puo9KyiNN42E8Sd2Kh1jq3vT29u
    console.log("response_status", response_status);
    if (response_status === 200) {
      console.log("business card minted");
      // get json data from response
      console.log("xray url", xray_url);
      alert(`Business card minted! View it here: ${xray_url}`);
    } else if (response_status === 500) {
      console.log("error minting business card");
    }
  }

  const renderForm = () => {
    return (
      // create a tailwind styled form
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="firstName"
          >
            First Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
            style={firstName ? {} : { border: "1px solid red" }}
            id="firstName"
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="lastName"
          >
            Last Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight"
            style={lastName ? {} : { border: "1px solid red" }}
            id="lastName"
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />

          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="jobTitle"
          >
            Job Title
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight"
            style={jobTitle ? {} : { border: "1px solid red" }}
            id="jobTitle"
            type="text"
            placeholder="Job Title"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="phone"
          >
            Phone
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight"
            // if there is no phone number give the style a red border
            style={phone ? {} : { border: "1px solid red" }}
            id="phone"
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight"
            style={email ? {} : { border: "1px solid red" }}
            id="email"
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Website
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight"
            style={website ? {} : { border: "1px solid red" }}
            id="website"
            type="text"
            placeholder="Website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />

          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="airdropTo"
          >
            Airdrop To
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight"
            style={airdropTo ? {} : { border: "1px solid red" }}
            id="airdropTo"
            type="text"
            placeholder="Airdrop To"
            value={airdropTo}
            onChange={(e) => setAirdropTo(e.target.value)}
          />

          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="creatorAddress"
          >
            Creator Address
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight"
            style={creatorAddress ? {} : { border: "1px solid red" }}
            id="creatorAddress"
            type="text"
            placeholder="Creator Address"
            value={creatorAddress}
            onChange={(e) => setCreatorAddress(e.target.value)}
          />
        </div>
      </form>
    );
  };

  return (
    <div>
      cNFT business card
      {renderForm()}
      <svg
        id="svg-container"
        width="640"
        height="640"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="640" height="640" fill="black" />
        <svg
          width="300"
          height="200"
          viewBox="0 0 782 200"
          x="150"
          y="-20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse
            cx="21.4891"
            cy="17.6635"
            rx="17.1912"
            ry="17.6635"
            fill="red"
          />
          <ellipse
            cx="21.4891"
            cy="71.0932"
            rx="17.1912"
            ry="17.6635"
            fill="red"
          />
          <ellipse
            cx="21.4891"
            cy="124.528"
            rx="17.1912"
            ry="17.6635"
            fill="red"
          />
          <ellipse
            cx="21.4891"
            cy="177.957"
            rx="17.1912"
            ry="17.6635"
            fill="red"
          />
          <ellipse
            cx="73.0633"
            cy="44.1589"
            rx="17.1912"
            ry="17.6635"
            fill="red"
          />
          <ellipse
            cx="73.0633"
            cy="97.5929"
            rx="17.1912"
            ry="17.6635"
            fill="red"
          />
          <ellipse
            cx="73.0633"
            cy="151.023"
            rx="17.1912"
            ry="17.6635"
            fill="red"
          />
          <ellipse
            cx="124.637"
            cy="70.6537"
            rx="17.1912"
            ry="17.6635"
            fill="red"
          />
          <ellipse
            cx="176.211"
            cy="98.0324"
            rx="17.1912"
            ry="17.6635"
            fill="red"
          />
          <ellipse
            cx="124.637"
            cy="124.088"
            rx="17.1912"
            ry="17.6635"
            fill="red"
          />
          <ellipse
            cx="21.4891"
            cy="17.6635"
            rx="17.1912"
            ry="17.6635"
            fill="red"
          />
          <ellipse
            cx="21.4891"
            cy="71.0976"
            rx="17.1912"
            ry="17.6635"
            fill="red"
          />
          <path
            d="M6.44685 26.0535L14.6121 26.4951L15.0419 65.3547H5.23926C9.96684 53.8735 15.4722 46.3665 6.44685 26.0535Z"
            fill="red"
          />
          <path
            d="M36.1022 26.9368H27.9364L27.5066 65.7964H37.8213C33.0937 54.3152 27.0768 47.2498 36.1022 26.9368Z"
            fill="red"
          />
          <rect
            x="12.8936"
            y="31.7942"
            width="16.3317"
            height="26.4952"
            fill="red"
          />
          <ellipse
            rx="17.5677"
            ry="18.4918"
            transform="matrix(0.443056 -0.896494 0.886586 0.462564 126.225 71.2557)"
            fill="red"
          />
          <ellipse
            rx="17.5677"
            ry="18.4918"
            transform="matrix(0.443056 -0.896494 0.886586 0.462564 175.821 97.1314)"
            fill="red"
          />
          <path
            d="M127.201 89.0988L131.308 81.8322L167.57 100.256L163.132 109.237C154.616 99.346 150.141 90.667 127.201 89.0988Z"
            fill="red"
          />
          <path
            d="M141.448 62.3596L137.751 69.8405L173.624 89.0523L178.295 79.6027C165.498 78.3739 156.216 80.4647 141.448 62.3596Z"
            fill="red"
          />
          <rect
            width="16.6893"
            height="27.7377"
            transform="matrix(0.443056 -0.896494 0.886586 0.462564 135.449 85.9729)"
            fill="red"
          />
          <ellipse
            rx="17.5714"
            ry="18.0435"
            transform="matrix(0.434263 0.900786 -0.891216 0.453579 72.3566 151.227)"
            fill="red"
          />
          <ellipse
            rx="17.5714"
            ry="18.0435"
            transform="matrix(0.434263 0.900786 -0.891216 0.453579 23.7111 175.985)"
            fill="red"
          />
          <path
            d="M58.0419 141.266L61.2642 148.989L26.0775 167.39L21.7264 158.364C34.2772 157.397 43.5552 158.988 58.0419 141.266Z"
            fill="red"
          />
          <path
            d="M70.401 168.978L66.7765 161.46L31.2082 179.069L35.7866 188.566C44.1406 178.894 47.9022 170.08 70.401 168.978Z"
            fill="red"
          />
          <rect
            width="16.6929"
            height="27.0653"
            transform="matrix(0.434263 0.900786 -0.891216 0.453579 55.6777 149.861)"
            fill="red"
          />
          <path
            d="M332.8 101.7C330.6 98.9667 327.7 97.6 324.1 97.6C322.833 97.6 321.6 97.9 320.4 98.5C319.2 99.1 318.6 100.133 318.6 101.6C318.6 102.8 319.2 103.7 320.4 104.3C321.667 104.833 323.233 105.333 325.1 105.8C327.033 106.2 329.067 106.667 331.2 107.2C333.4 107.667 335.433 108.433 337.3 109.5C339.233 110.567 340.8 112.033 342 113.9C343.267 115.7 343.9 118.133 343.9 121.2C343.9 124.333 343.2 126.933 341.8 129C340.467 131 338.733 132.633 336.6 133.9C334.467 135.1 332.067 135.933 329.4 136.4C326.733 136.933 324.1 137.2 321.5 137.2C318.1 137.2 314.667 136.733 311.2 135.8C307.733 134.8 304.8 133.067 302.4 130.6L311.5 120.5C312.9 122.233 314.433 123.567 316.1 124.5C317.833 125.367 319.833 125.8 322.1 125.8C323.833 125.8 325.4 125.567 326.8 125.1C328.2 124.567 328.9 123.633 328.9 122.3C328.9 121.033 328.267 120.1 327 119.5C325.8 118.833 324.233 118.3 322.3 117.9C320.433 117.433 318.4 116.967 316.2 116.5C314.067 115.967 312.033 115.2 310.1 114.2C308.233 113.2 306.667 111.8 305.4 110C304.2 108.133 303.6 105.667 303.6 102.6C303.6 99.7333 304.167 97.2667 305.3 95.2C306.5 93.1333 308.033 91.4333 309.9 90.1C311.833 88.7667 314.033 87.8 316.5 87.2C318.967 86.5333 321.467 86.2 324 86.2C327.2 86.2 330.433 86.6667 333.7 87.6C336.967 88.5333 339.733 90.2 342 92.6L332.8 101.7ZM345.789 87.4H361.789L371.689 117.9H371.889L380.189 87.4H396.589L405.589 117.9H405.789L414.889 87.4H430.089L412.789 136H397.989L387.889 103.7H387.689L378.689 136H363.589L345.789 87.4ZM435.09 87.4H450.09V136H435.09V87.4ZM433.89 72.1C433.89 69.7 434.723 67.6667 436.39 66C438.123 64.2667 440.19 63.4 442.59 63.4C444.99 63.4 447.023 64.2667 448.69 66C450.423 67.6667 451.29 69.7 451.29 72.1C451.29 74.5 450.423 76.5667 448.69 78.3C447.023 79.9667 444.99 80.8 442.59 80.8C440.19 80.8 438.123 79.9667 436.39 78.3C434.723 76.5667 433.89 74.5 433.89 72.1ZM488.366 101.7C486.166 98.9667 483.266 97.6 479.666 97.6C478.4 97.6 477.166 97.9 475.966 98.5C474.766 99.1 474.166 100.133 474.166 101.6C474.166 102.8 474.766 103.7 475.966 104.3C477.233 104.833 478.8 105.333 480.666 105.8C482.6 106.2 484.633 106.667 486.766 107.2C488.966 107.667 491 108.433 492.866 109.5C494.8 110.567 496.366 112.033 497.566 113.9C498.833 115.7 499.466 118.133 499.466 121.2C499.466 124.333 498.766 126.933 497.366 129C496.033 131 494.3 132.633 492.166 133.9C490.033 135.1 487.633 135.933 484.966 136.4C482.3 136.933 479.666 137.2 477.066 137.2C473.666 137.2 470.233 136.733 466.766 135.8C463.3 134.8 460.366 133.067 457.966 130.6L467.066 120.5C468.466 122.233 470 123.567 471.666 124.5C473.4 125.367 475.4 125.8 477.666 125.8C479.4 125.8 480.966 125.567 482.366 125.1C483.766 124.567 484.466 123.633 484.466 122.3C484.466 121.033 483.833 120.1 482.566 119.5C481.366 118.833 479.8 118.3 477.866 117.9C476 117.433 473.966 116.967 471.766 116.5C469.633 115.967 467.6 115.2 465.666 114.2C463.8 113.2 462.233 111.8 460.966 110C459.766 108.133 459.166 105.667 459.166 102.6C459.166 99.7333 459.733 97.2667 460.866 95.2C462.066 93.1333 463.6 91.4333 465.466 90.1C467.4 88.7667 469.6 87.8 472.066 87.2C474.533 86.5333 477.033 86.2 479.566 86.2C482.766 86.2 486 86.6667 489.266 87.6C492.533 88.5333 495.3 90.2 497.566 92.6L488.366 101.7ZM534.655 101.7C532.455 98.9667 529.555 97.6 525.955 97.6C524.689 97.6 523.455 97.9 522.255 98.5C521.055 99.1 520.455 100.133 520.455 101.6C520.455 102.8 521.055 103.7 522.255 104.3C523.522 104.833 525.089 105.333 526.955 105.8C528.889 106.2 530.922 106.667 533.055 107.2C535.255 107.667 537.289 108.433 539.155 109.5C541.089 110.567 542.655 112.033 543.855 113.9C545.122 115.7 545.755 118.133 545.755 121.2C545.755 124.333 545.055 126.933 543.655 129C542.322 131 540.589 132.633 538.455 133.9C536.322 135.1 533.922 135.933 531.255 136.4C528.589 136.933 525.955 137.2 523.355 137.2C519.955 137.2 516.522 136.733 513.055 135.8C509.589 134.8 506.655 133.067 504.255 130.6L513.355 120.5C514.755 122.233 516.289 123.567 517.955 124.5C519.689 125.367 521.689 125.8 523.955 125.8C525.689 125.8 527.255 125.567 528.655 125.1C530.055 124.567 530.755 123.633 530.755 122.3C530.755 121.033 530.122 120.1 528.855 119.5C527.655 118.833 526.089 118.3 524.155 117.9C522.289 117.433 520.255 116.967 518.055 116.5C515.922 115.967 513.889 115.2 511.955 114.2C510.089 113.2 508.522 111.8 507.255 110C506.055 108.133 505.455 105.667 505.455 102.6C505.455 99.7333 506.022 97.2667 507.155 95.2C508.355 93.1333 509.889 91.4333 511.755 90.1C513.689 88.7667 515.889 87.8 518.355 87.2C520.822 86.5333 523.322 86.2 525.855 86.2C529.055 86.2 532.289 86.6667 535.555 87.6C538.822 88.5333 541.589 90.2 543.855 92.6L534.655 101.7ZM555.345 65.2H578.745C584.411 65.2 589.778 65.8333 594.845 67.1C599.978 68.3667 604.445 70.4333 608.245 73.3C612.045 76.1 615.045 79.7667 617.245 84.3C619.511 88.8333 620.645 94.3333 620.645 100.8C620.645 106.533 619.545 111.6 617.345 116C615.211 120.333 612.311 124 608.645 127C604.978 129.933 600.745 132.167 595.945 133.7C591.145 135.233 586.111 136 580.845 136H555.345V65.2ZM570.945 121.6H579.045C582.645 121.6 585.978 121.233 589.045 120.5C592.178 119.767 594.878 118.567 597.145 116.9C599.411 115.167 601.178 112.933 602.445 110.2C603.778 107.4 604.445 104 604.445 100C604.445 96.5333 603.778 93.5333 602.445 91C601.178 88.4 599.445 86.2667 597.245 84.6C595.045 82.9333 592.445 81.7 589.445 80.9C586.511 80.0333 583.411 79.6 580.145 79.6H570.945V121.6ZM654.523 65.2H667.423L698.223 136H680.623L674.523 121H647.023L641.123 136H623.923L654.523 65.2ZM660.523 85.8L651.923 107.8H669.223L660.523 85.8ZM701.545 100.6C701.545 94.9333 702.478 89.8 704.345 85.2C706.278 80.6 708.945 76.7 712.345 73.5C715.745 70.2333 719.778 67.7333 724.445 66C729.111 64.2667 734.211 63.4 739.745 63.4C745.278 63.4 750.378 64.2667 755.045 66C759.711 67.7333 763.745 70.2333 767.145 73.5C770.545 76.7 773.178 80.6 775.045 85.2C776.978 89.8 777.945 94.9333 777.945 100.6C777.945 106.267 776.978 111.4 775.045 116C773.178 120.6 770.545 124.533 767.145 127.8C763.745 131 759.711 133.467 755.045 135.2C750.378 136.933 745.278 137.8 739.745 137.8C734.211 137.8 729.111 136.933 724.445 135.2C719.778 133.467 715.745 131 712.345 127.8C708.945 124.533 706.278 120.6 704.345 116C702.478 111.4 701.545 106.267 701.545 100.6ZM717.745 100.6C717.745 103.933 718.245 107 719.245 109.8C720.311 112.533 721.811 114.933 723.745 117C725.678 119 727.978 120.567 730.645 121.7C733.378 122.833 736.411 123.4 739.745 123.4C743.078 123.4 746.078 122.833 748.745 121.7C751.478 120.567 753.811 119 755.745 117C757.678 114.933 759.145 112.533 760.145 109.8C761.211 107 761.745 103.933 761.745 100.6C761.745 97.3333 761.211 94.3 760.145 91.5C759.145 88.7 757.678 86.3 755.745 84.3C753.811 82.2333 751.478 80.6333 748.745 79.5C746.078 78.3667 743.078 77.8 739.745 77.8C736.411 77.8 733.378 78.3667 730.645 79.5C727.978 80.6333 725.678 82.2333 723.745 84.3C721.811 86.3 720.311 88.7 719.245 91.5C718.245 94.3 717.745 97.3333 717.745 100.6Z"
            fill="white"
          />
        </svg>
        <text x="290" y="125" fill="white" fontSize="20">
          Business Card
        </text>
        <text x="50" y="300" fill="white" fontSize="36" fontWeight="bold">
          {firstName} {lastName}
        </text>
        {/* make job title italics */}
        <text x="50" y="360" fill="white" fontSize="32" fontStyle="italic">
          {jobTitle}
        </text>

        <text x="50" y="420" fill="white" fontSize="30">
          Phone: {phone}
        </text>

        <text x="50" y="460" fill="white" fontSize="30">
          Email: {email}
        </text>

        <text x="50" y="520" fill="white" fontSize="30">
          Website: {website}
        </text>
      </svg>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => convertAndSubmit()}
      >
        Create cNFT
      </button>
    </div>
  );
};

export default Page;
