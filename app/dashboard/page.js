// rafce -> shortcut arrow function
import Image from "next/image";

import React from "react";
import styles from "./page.module.css";
import { Circle } from "./_components/circle";
import Sidebar from "./_components/sidebar";

const Dashboard = () => {
  const taglines = [
    "Green March 2024",
    "Climate change effects on earth",
    "Meet other members ",
    "Meet other members ",
    "Meet other members ",
    "Meet other members ",
  ];

  return (
    <div>
      {/* Sidebar */}
      <Sidebar />

      {/* nav bar */}
      <div className={styles.navbar}>
        {/* <Image
          src="https://plus.unsplash.com/premium_photo-1661914978519-52a11fe159a7?q=80&w=3135&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          width={50}
          alt="App Logo"
          height={50}
        /> */}

        <p>App Logo</p>
        <p>EcoGo</p>
        <p>Icon</p>
      </div>
      {/* main section with image and text */}
      <div className={styles.main}>
        <h3>It Starts With You, Prunella (Username)</h3>
      </div>
      {/* for the circle */}
      <div className={styles.row}>
        {taglines.map((tagline, index) => (
          <Circle key={index} tagline={tagline} />
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
