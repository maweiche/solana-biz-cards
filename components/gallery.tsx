import { useState, useEffect } from "react";

const Gallery = () => {
  const [bizCards, setBizCards] = useState<Array<any>>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const check_for_biz_cards = async (address: string) => {
    const url = process.env.NEXT_PUBLIC_RPC_URL;

    const response = await fetch(url!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "helius-test",
        method: "getAssetsByCreator",
        params: {
          creatorAddress: address, // Required
          onlyVerified: false, // Optional
          page: 1, // Starts at 1
          limit: 1000, // Max 1000
        },
      }),
    });
    const { result } = await response.json();
    console.log("Assets by Creator: ", result.items);

    setBizCards(result.items);
    setLoading(false);
  };

  useEffect(() => {
    check_for_biz_cards(process.env.NEXT_PUBLIC_WALLET_ADDRESS!);
  }, []);

  return (
    <div>
      <h1>Gallery</h1>
      <div className="grid grid-flow-row auto-rows-max">
        {loading ? <p>Loading...</p> : null}
        {bizCards.map((bizCard, index) => {
          return (
            <div key={index}>
              <img
                src={bizCard.content.links.image}
                alt="business card"
                style={{
                  border: "1px solid white",
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Gallery;
