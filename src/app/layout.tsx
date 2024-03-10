import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SeiSaw",
  description:
    "Explore the world of digital art on our NFT platform, where creativity thrives on the blockchain canvas. Discover unique pieces and join a community of artists and collectors today.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >  
            <div className="container-lg">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
