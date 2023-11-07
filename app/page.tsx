"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
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
  const { register, handleSubmit } = useForm();
  const [data, setData] = useState<string>("");
  const [showGallery, setShowGallery] = useState<boolean>(false);
  const [selectedSvg, setSelectedSvg] = useState<string>("svg-container");

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
    // if the airdropTo address has the last 4 characters of .sol then getPublicKeyFromSolDomain else return the airdropTo address
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
    const airdropTo = JSON.parse(data).airdropTo;
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
        info: data,
        image: svg,
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
      toast.error("Error minting business card", {
        position: "top-right",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "dark",
      });
    }
  }

  const renderForm = () => {
    return (
      <form
        className="bg-white sm:max-w-sm shadow-md rounded px-8 pt-6 pb-8 mb-4 items-center justify-center"
        style={{
          width: "60vw",
          justifyContent: "center",
          alignContent: "center",
          overflowX: "hidden",
          alignItems: "center",
          margin: "0 auto",
        }}
        onChange={handleSubmit((data) => setData(JSON.stringify(data)))}
      >
        <div className="mb-2 sm:max-w-sm sm:mx-auto">
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight sm:max-w-sm sm:mx-auto"
            {...register("firstName")}
            placeholder="First name"
          />
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight sm:max-w-sm sm:mx-auto"
            {...register("lastName")}
            placeholder="Last name"
          />
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight sm:max-w-sm sm:mx-auto"
            {...register("jobTitle")}
            placeholder="Job title"
          />
          {selectedSvg === "svg-container" ||
          selectedSvg === "svg-container-style2" ? (
            <>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight sm:max-w-sm sm:mx-auto"
                {...register("email")}
                placeholder="Email"
              />
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight sm:max-w-sm sm:mx-auto"
                {...register("phone")}
                placeholder="Phone"
              />
            </>
          ) : (
            <>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight sm:max-w-sm sm:mx-auto"
                {...register("twitter")}
                placeholder="Twitter"
              />
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight sm:max-w-sm sm:mx-auto"
                {...register("telegram")}
                placeholder="Telegram"
              />
            </>
          )}
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight sm:max-w-sm sm:mx-auto"
            {...register("website")}
            placeholder="Website"
          />
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight sm:max-w-sm sm:mx-auto"
            {...register("airdropTo")}
            placeholder="Airdrop To"
          />
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight sm:max-w-sm sm:mx-auto"
            {...register("creatorAddress")}
            placeholder="Creator Address"
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
            firstName={data ? JSON.parse(data).firstName : ""}
            lastName={data ? JSON.parse(data).lastName : ""}
            jobTitle={data ? JSON.parse(data).jobTitle : ""}
            phone={data ? JSON.parse(data).phone : ""}
            email={data ? JSON.parse(data).email : ""}
            website={data ? JSON.parse(data).website : ""}
          />
          <Svg_Style2
            firstName={data ? JSON.parse(data).firstName : ""}
            lastName={data ? JSON.parse(data).lastName : ""}
            jobTitle={data ? JSON.parse(data).jobTitle : ""}
            phone={data ? JSON.parse(data).phone : ""}
            email={data ? JSON.parse(data).email : ""}
            website={data ? JSON.parse(data).website : ""}
          />
          <Svg_Style3
            firstName={data ? JSON.parse(data).firstName : ""}
            lastName={data ? JSON.parse(data).lastName : ""}
            jobTitle={data ? JSON.parse(data).jobTitle : ""}
            twitter={data ? JSON.parse(data).twitter : ""}
            telegram={data ? JSON.parse(data).telegram : ""}
            website={data ? JSON.parse(data).website : ""}
          />
          <Svg_Style4
            firstName={data ? JSON.parse(data).firstName : ""}
            lastName={data ? JSON.parse(data).lastName : ""}
            jobTitle={data ? JSON.parse(data).jobTitle : ""}
            twitter={data ? JSON.parse(data).twitter : ""}
            telegram={data ? JSON.parse(data).telegram : ""}
            website={data ? JSON.parse(data).website : ""}
          />
          <div
            className="flex flex-row gap-4 justify-center align-center md:flex-row sm:flex-col xs:flex-col wrap"
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
              <span
                className="text-white font-bold"
                style={{ paddingLeft: "50px" }}
              >
                Style 1
              </span>
              <Sample
                firstName={data ? JSON.parse(data).firstName : ""}
                lastName={data ? JSON.parse(data).lastName : ""}
                jobTitle={data ? JSON.parse(data).jobTitle : ""}
                phone={data ? JSON.parse(data).phone : ""}
                email={data ? JSON.parse(data).email : ""}
                website={data ? JSON.parse(data).website : ""}
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
              <span
                className="text-white font-bold"
                style={{ paddingLeft: "50px" }}
              >
                Style 2
              </span>
              <Sample_Style2
                firstName={data ? JSON.parse(data).firstName : ""}
                lastName={data ? JSON.parse(data).lastName : ""}
                jobTitle={data ? JSON.parse(data).jobTitle : ""}
                phone={data ? JSON.parse(data).phone : ""}
                email={data ? JSON.parse(data).email : ""}
                website={data ? JSON.parse(data).website : ""}
              />
            </div>
          </div>
          <div
            className="flex flex-row gap-4 justify-center align-center md:flex-row sm:flex-col xs:flex-col wrap"
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
              <span
                className="text-white font-bold"
                style={{ paddingLeft: "50px" }}
              >
                Style 3
              </span>
              <Sample_Style3
                firstName={data ? JSON.parse(data).firstName : ""}
                lastName={data ? JSON.parse(data).lastName : ""}
                jobTitle={data ? JSON.parse(data).jobTitle : ""}
                twitter={data ? JSON.parse(data).twitter : ""}
                telegram={data ? JSON.parse(data).telegram : ""}
                website={data ? JSON.parse(data).website : ""}
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
              <span
                className="text-white font-bold"
                style={{ paddingLeft: "50px" }}
              >
                Style 4
              </span>
              <Sample_Style4
                firstName={data ? JSON.parse(data).firstName : ""}
                lastName={data ? JSON.parse(data).lastName : ""}
                jobTitle={data ? JSON.parse(data).jobTitle : ""}
                twitter={data ? JSON.parse(data).twitter : ""}
                telegram={data ? JSON.parse(data).telegram : ""}
                website={data ? JSON.parse(data).website : ""}
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
