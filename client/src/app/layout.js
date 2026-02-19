
import React, { use } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import 'bootstrap/dist/css/bootstrap.min.css';
import Providers from "@/redux/Provider";
import Script from "next/script";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Yojana Dashboard",
  description: "Dashboard for managing office information",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
       
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
      <Providers>
        {children}
      </Providers>
      
      </body>
    </html>
  );
}
