"use client";
import { useState } from "react";
import Link from "next/link";
import Logo from "../components/logo";
import Svg from "../components/svg";
import Svg_Style2 from "@/components/svg_style2";
import Svg_Style3 from "@/components/svg_style3";
import Svg_Style4 from "@/components/svg_style4";
import Sample from "../components/sample";
import Sample_Style2 from "@/components/sample_style2";
import Sample_Style3 from "@/components/sample_style3";
import Sample_Style4 from "@/components/sample_style4";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { getDomainKeySync, NameRegistryState } from "@bonfida/spl-name-service";
import Gallery from "@/components/gallery";

const RPC = process.env.NEXT_PUBLIC_RPC_URL || clusterApiUrl("mainnet-beta"); //replace with your HTTP Provider from https://www.quicknode.com/endpoints
const SOLANA_CONNECTION = new Connection(RPC);

const Page: React.FC = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [jobTitle, setJobTitle] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [twitter, setTwitter] = useState<string>("");
  const [telegram, setTelegram] = useState<string>("");
  const [website, setWebsite] = useState<string>("");
  const [airdropTo, setAirdropTo] = useState<string>("");
  const [creatorAddress, setCreatorAddress] = useState<string>("");
  const [showGallery, setShowGallery] = useState<boolean>(false);
  const [selectedSvg, setSelectedSvg] = useState<string>("");

  const CustomToastWithLink = (url: string) => (
    <Link href={url} target="_blank" rel="noopener noreferrer">
      View your business card on the blockchain
    </Link>
  );

  async function getPublicKeyFromSolDomain(domain: string): Promise<string> {
    const { pubkey } = await getDomainKeySync(domain);
    const owner = (
      await NameRegistryState.retrieve(SOLANA_CONNECTION, pubkey)
    ).registry.owner.toBase58();
    console.log(`The owner of SNS Domain: ${domain} is: `, owner);
    return owner;
  }

  async function checkForSolanaDomain(address: string) {
    // if the airdropTo address has the last 4 characters of .sol then send it to the /namesearch endpoint and await the response, else return the airdropTo address
    if (address.slice(-4) === ".sol") {
      const solana_domain = address;
      const solana_domain_owner =
        await getPublicKeyFromSolDomain(solana_domain);
      return solana_domain_owner;
    } else {
      return address;
    }
  }

  async function convertAndSubmit() {
    const image = document.getElementById(selectedSvg);
    const svg = new XMLSerializer().serializeToString(image!);

    console.log("checking for solana domain");
    const airdrop_publickey = await checkForSolanaDomain(airdropTo);
    console.log("airdrop_publickey", airdrop_publickey);
    console.log("minting business card");
    const res = await fetch("/api/mint", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: svg,
        firstName: firstName,
        lastName: lastName,
        jobTitle: jobTitle,
        email: email,
        phone: phone,
        website: website,
        airdropTo: airdrop_publickey,
        creatorAddress: creatorAddress,
      }),
    });

    const response_status = res.status;
    const res_text = await JSON.parse(await res.text());
    console.log("res_text", res_text);
    const asset_id = res_text.assetId;
    console.log("asset_id", asset_id);
    const xray_url = `https://xray.helius.xyz/token/${asset_id}?network=mainnet`;
    if (response_status === 200) {
      console.log("business card minted");
      // get json data from response
      console.log("xray url", xray_url);
      toast.success(CustomToastWithLink(xray_url), {
        position: "top-right",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "dark",
      });
    } else if (response_status === 500) {
      console.log("error minting business card");
    }
  }

  const renderForm = () => {
    return (
      <form className="bg-white sm:max-w-sm shadow-md rounded px-8 pt-6 pb-8 mb-4 items-center justify-center"
        style={{
          width: "60vw",
          justifyContent: "center",
          alignContent: "center",
          overflowX: "hidden",
          alignItems: "center",
          margin: "0 auto",
        }}
      >
        <div className="mb-2 sm:max-w-sm sm:mx-auto">
          <label
            className="block text-gray-700 text-sm font-bold"
            htmlFor="firstName"
          >
            First Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight sm:max-w-sm sm:mx-auto"
            style={firstName ? {} : { border: "1px solid red" }}
            id="firstName"
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="mb-2 sm:max-w-sm sm:mx-auto">
          <label
            className="block text-gray-700 text-sm font-bold"
            htmlFor="lastName"
          >
            Last Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight sm:max-w-sm sm:mx-auto"
            style={lastName ? {} : { border: "1px solid red" }}
            id="lastName"
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <label
            className="block text-gray-700 text-sm font-bold"
            htmlFor="jobTitle"
          >
            Job Title
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight sm:max-w-sm sm:mx-auto"
            style={jobTitle ? {} : { border: "1px solid red" }}
            id="jobTitle"
            type="text"
            placeholder="Job Title"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
        </div>
        <div className="mb-2 sm:max-w-sm sm:mx-auto">
          {selectedSvg === "svg-container" ||
          selectedSvg === "svg-container-style2" ||
          selectedSvg === "" ? (
            <>
              <label
                className="block text-gray-700 text-sm font-bold"
                htmlFor="phone"
              >
                Phone
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight sm:max-w-sm sm:mx-auto"
                style={phone ? {} : { border: "1px solid red" }}
                id="phone"
                type="text"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <label
                className="block text-gray-700 text-sm font-bold"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight sm:max-w-sm sm:mx-auto"
                style={email ? {} : { border: "1px solid red" }}
                id="email"
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </>
          ) : (
            <>
              <label
                className="block text-gray-700 text-sm font-bold"
                htmlFor="twitter"
              >
                Twitter
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight sm:max-w-sm sm:mx-auto"
                style={twitter ? {} : { border: "1px solid red" }}
                id="twitter"
                type="text"
                placeholder="Twitter"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
              />

              <label
                className="block text-gray-700 text-sm font-bold"
                htmlFor="telegram"
              >
                Telegram
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight sm:max-w-sm sm:mx-auto"
                style={telegram ? {} : { border: "1px solid red" }}
                id="telegram"
                type="text"
                placeholder="Telegram"
                value={telegram}
                onChange={(e) => setTelegram(e.target.value)}
              />
            </>
          )}
          <label
            className="block text-gray-700 text-sm font-bold"
            htmlFor="email"
          >
            Website
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight sm:max-w-sm sm:mx-auto"
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        alignContent: "center",
        overflowX: "hidden",
        backgroundColor: "black",
      }}
    >
      <ToastContainer />
      <Logo />
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={() => setShowGallery(!showGallery)}
      >
        {showGallery ? "Hide Gallery" : "Show Gallery"}
      </button>
      {showGallery && <Gallery />}
      {!showGallery && (
        <div className="flex flex-col gap-4 justify-center">
          {renderForm()}
          <Svg
            firstName={firstName}
            lastName={lastName}
            jobTitle={jobTitle}
            phone={phone}
            email={email}
            website={website}
          />
          <Svg_Style2
            firstName={firstName}
            lastName={lastName}
            jobTitle={jobTitle}
            phone={phone}
            email={email}
            website={website}
          />
          <Svg_Style3
            firstName={firstName}
            lastName={lastName}
            jobTitle={jobTitle}
            twitter={twitter}
            telegram={telegram}
            website={website}
          />
          <Svg_Style4
            firstName={firstName}
            lastName={lastName}
            jobTitle={jobTitle}
            twitter={twitter}
            telegram={telegram}
            website={website}
          />
          <div className="flex flex-row gap-4 justify-center align-center md:flex-row sm:flex-col xs:flex-col wrap"
            style={{
              display: "flex",
              flexDirection: "column",
              width: "90vw",
              justifyContent: "center",
              alignContent: "center",
              overflowX: "hidden",
              backgroundColor: "black",
              alignItems: "center",
              margin: "0 auto",
            }}
          >
            <div
              className="flex flex-col gap-4 justify-center align-center cursor-pointer"
              style={{
                border:
                  selectedSvg === "svg-container" ? "1px solid yellow" : "",
                padding: selectedSvg === "svg-container" ? "5px" : "",
              }}
              onClick={() => {
                setSelectedSvg("svg-container");
              }}
            >
              <span className="text-white font-bold" style={{paddingLeft: "50px"}}>Style 1</span>
              <Sample
                firstName={firstName}
                lastName={lastName}
                jobTitle={jobTitle}
                phone={phone}
                email={email}
                website={website}
              />
            </div>
            <div
              className="flex flex-col gap-4 justify-center align-center cursor-pointer"
              style={{
                border:
                  selectedSvg === "svg-container-style2"
                    ? "1px solid yellow"
                    : "",
                padding: selectedSvg === "svg-container-style2" ? "5px" : "",
              }}
              onClick={() => {
                setSelectedSvg("svg-container-style2");
              }}
            >
              <span className="text-white font-bold" style={{paddingLeft: "50px"}}>Style 2</span>
              <Sample_Style2
                firstName={firstName}
                lastName={lastName}
                jobTitle={jobTitle}
                phone={phone}
                email={email}
                website={website}
              />
            </div>
          </div>
          <div className="flex flex-row gap-4 justify-center align-center md:flex-row sm:flex-col xs:flex-col wrap"
            style={{
              display: "flex",
              flexDirection: "column",
              width: "90vw",
              justifyContent: "center",
              alignContent: "center",
              overflowX: "hidden",
              backgroundColor: "black",
              alignItems: "center",
              margin: "0 auto",
            }}
          >
            <div
              className="flex flex-col gap-4 justify-center align-center cursor-pointer"
              style={{
                border:
                  selectedSvg === "svg-container-style3"
                    ? "1px solid yellow"
                    : "",
                padding: selectedSvg === "svg-container-style3" ? "5px" : "",
              }}
              onClick={() => {
                setSelectedSvg("svg-container-style3");
              }}
            >
              <span className="text-white font-bold" style={{paddingLeft: "50px"}}>Style 3</span>
              <Sample_Style3
                firstName={firstName}
                lastName={lastName}
                jobTitle={jobTitle}
                twitter={twitter}
                telegram={telegram}
                website={website}
              />
            </div>
            <div
              className="flex flex-col gap-4 justify-center align-center cursor-pointer"
              style={{
                border:
                  selectedSvg === "svg-container-style4"
                    ? "1px solid yellow"
                    : "",
                padding: selectedSvg === "svg-container-style4" ? "5px" : "",
              }}
              onClick={() => {
                setSelectedSvg("svg-container-style4");
              }}
            >
              <span className="text-white font-bold" style={{paddingLeft: "50px"}}>Style 4</span>
              <Sample_Style4
                firstName={firstName}
                lastName={lastName}
                jobTitle={jobTitle}
                twitter={twitter}
                telegram={telegram}
                website={website}
              />
            </div>
          </div>
          {selectedSvg != "" && (
            <div className="flex justify-center">
              <button
                className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => convertAndSubmit()}
              >
                Create cNFT
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Page;
