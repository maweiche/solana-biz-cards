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
        <main className="min-h-screen bg-background flex flex-col items-center">
          {children}
        </main>
      </body>
    </html>
  );
}
