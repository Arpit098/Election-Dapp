"use client"
import "./globals.css";
import { BlockchainProvider } from "./Context/BlockchainProvider";
import { NextUIProvider } from "@nextui-org/react";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <BlockchainProvider>
          <NextUIProvider>
          {children}
          </NextUIProvider>        
        </BlockchainProvider>  
      </body>
    </html>
  );
}
