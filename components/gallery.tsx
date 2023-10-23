import { useState, useEffect } from "react";

const Gallery = () => {
  const [biz_cards, setBizCards] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
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
          creatorAddress: address,
          onlyVerified: false,
          page: 1, // Starts at 1
          limit: 1000,
        },
      }),
    });
    const { result } = await response.json();
    console.log("Assets by Creator: ", result.items);

    setBizCards(result.items);
    setLoading(false);
  };

  useEffect(() => {
    check_for_biz_cards("HZxkqBTnXtAYoFTg2puo9KyiNN42E8Sd2Kh1jq3vT29u");
  }, []);

  return (
    <div>
      <h1>Gallery</h1>
      <div className="grid grid-cols-3 gap-4">
        {loading ? <p>Loading...</p> : null}
        {biz_cards.map((biz_card, index) => {
          return (
            <div key={index}>
              <img
                src={biz_card.content.links.image}
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
