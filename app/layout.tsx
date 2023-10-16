import "./globals.css";

export const metadata = {
  title: "swissDAO Business Cards",
  description: "Create your own business card cNFT",
};
export const dynamic = "force-dynamic";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="en" 
      className="bg-slate-950 flex flex-col items-center justify-center"
      style={{ width: "100vw", justifyContent: "center", alignContent:"center" }}
    >
      <body>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
