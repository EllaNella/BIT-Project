"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "./_components/sidebar";
import Navbar from "./_components/navbar";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "./_components/footer";

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
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check localStorage for user's theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.setAttribute("data-theme", savedTheme);
      setIsDarkMode(savedTheme === "dark");
    } else {
      // Set default based on system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.setAttribute("data-theme", prefersDark ? "dark" : "light");
      setIsDarkMode(prefersDark);
    }
  }, []);

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
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Combat Climate Change</title>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Navbar onClick={toggleSidebar} onThemeToggle={toggleTheme} />
        {/* Sidebar */}
        {isSidebarOpened && <Sidebar onClick={toggleSidebar} />}
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
