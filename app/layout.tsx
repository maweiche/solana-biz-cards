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
    <html lang="en">
      <body>
        {/* make background black */}
        <main
          className="min-h-screen 
          bg-slate-950
          text-white
        flex flex-col items-center"
        >
          {children}
        </main>
      </body>
    </html>
  );
}
