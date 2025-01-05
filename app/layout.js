"use client";
import React, { useState } from "react";
import Sidebar from "./_components/sidebar";
import Navbar from "./_components/navbar";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const [isSidebarOpened, setIsSidebarOpened] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpened((prev) => !prev);
  };

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>My App</title>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Navbar onClick={toggleSidebar} />
        {/* Sidebar */}
        {isSidebarOpened && <Sidebar onClick={toggleSidebar} />}
        <main>{children}</main>
      </body>
    </html>
  );
}
