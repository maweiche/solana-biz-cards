"use client";
import React, { useState, useEffect, use } from "react";
import { remark } from "remark";
import html from "remark-html";
import { set } from "zod";

const Tutorial: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [urlIndex, setUrlIndex] = useState(0);
  const [urlList, setUrlList] = useState<string[]>([]);
  const [markdown, setMarkdown] = useState("");
  const [styledMarkdown, setStyledMarkdown] = useState("");
  async function fetchMarkdowns() {
    const map = await fetch(
      "https://raw.githubusercontent.com/swissDAO/solana-business-card-cnfts/main/map.json",
    );
    const map_json = await map.json();
    console.log(map_json);

    const urls = Object.keys(map_json).map((key) => {
      return `https://raw.githubusercontent.com/swissDAO/solana-business-card-cnfts/main/${key.slice(
        0,
        9,
      )}/${map_json[key]}`;
    });
    setUrlList(urls);
    console.log(urlList);
    setLoading(false);
  }

  const fetchMarkdownData = async () => {
    const res = await fetch(urlList[urlIndex]);
    const markdown = await res.text();
    console.log(markdown);
    setMarkdown(markdown);
  };

  async function getPostData() {
    const fileContents = markdown;

    // Use gray-matter to parse the post metadata section
    // const matterResult = matter(fileContents);

    // Use remark to convert markdown into HTML string
    const processedContent = await remark().use(html).process(markdown);
    const contentHtml = processedContent.toString();

    // Combine the data with the id and contentHtml
    setStyledMarkdown(contentHtml);
  }

  const renderMarkdown = () => {
    return <div dangerouslySetInnerHTML={{ __html: styledMarkdown }}></div>;
  };

  useEffect(() => {
    fetchMarkdowns();
    if (!loading) {
      fetchMarkdownData();
    }
    if (!loading && markdown) {
      getPostData();
    }
  }, [loading, markdown]);

  useEffect(() => {
    fetchMarkdownData().then(() => {
      getPostData();
    });
  }, [urlIndex]);

  return (
    <div>
      {urlIndex > 0 ? (
        <button
          onClick={() => {
            setUrlIndex(urlIndex - 1);
            fetchMarkdownData();
          }}
        >
          Previous
        </button>
      ) : (
        <></>
      )}
      {urlIndex < urlList.length - 1 ? (
        <button
          onClick={() => {
            setUrlIndex(urlIndex + 1);
            fetchMarkdownData();
          }}
        >
          Next
        </button>
      ) : (
        <></>
      )}

      {loading && styledMarkdown != "" ? (
        <div>Loading...</div>
      ) : (
        renderMarkdown()
      )}
    </div>
  );
};

export default Tutorial;
