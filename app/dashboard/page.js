// rafce -> shortcut arrow function
"use client";
import Image from "next/image";
import React, { useState } from "react";
import styles from "./page.module.css";
import { Circle } from "./_components/circle";
import CustomButton from "./_components/button";
import Sidebar from "./_components/sidebar";

const Dashboard = () => {
  const taglines = [
    "Green March 2024",
    "Climate change effects on earth",
    "Meet other members",
  ];

  const pages = ["/events", "/forum", "/about"];

  // Hook
  const [isSidebarOpened, setIsSidebarOpened] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpened(!isSidebarOpened);
  };
  return (
    <div>
      {/* Sidebar */}
      {isSidebarOpened ? <Sidebar onClick={toggleSidebar} /> : <div />}

      {/* nav bar */}
      <div className={styles.navbar}>
        <p>App Logo</p>
        <p>EcoGo</p>
        <CustomButton title={"Icon"} onClick={toggleSidebar} />
      </div>

      {/* main section with image and text */}
      <div className={styles.main}>
        <h3>It Starts With You, Prunella (Username)</h3>
      </div>

      {/* for the circle */}
      <div className={styles.row}>
        {taglines.map((tagline, index) => (
          <Circle key={index} tagline={tagline} page={pages[index]} />
        ))}
      </div>

      {/* footer */}
      <div className={styles.footer}>
        <p>
          2024 - EcoGo, Inc. All rights reserved. Address Item 1 | Item 2 | Item
          3
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
