"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "./_components/sidebar";
import Navbar from "./_components/navbar";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "./_components/footer";



// Importing fonts from Google Fonts using next/font
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

  //toggling sidebar on and off
  const toggleSidebar = () => {
    setIsSidebarOpened((prev) => !prev);
  };

  const toggleTheme = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    setIsDarkMode((prev) => !prev);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem('theme', newTheme); // Store the selected theme
  };

  return (
    <html lang="en">

      {/* Call for the head tag once to show title and stuff on every page*/}
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>EcoGo</title>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Navbar onClick={toggleSidebar}  />
        {/* Sidebar */}
        {isSidebarOpened && <Sidebar onClick={toggleSidebar} />}
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
