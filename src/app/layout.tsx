import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PRISM | AtomQuest Hackathon",
  description: "Performance, Recognition, Insights, Strategy & Metrics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
