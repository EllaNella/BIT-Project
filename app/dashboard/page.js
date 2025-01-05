// rafce -> shortcut arrow function
"use client";
import Image from "next/image";
import Link from "next/link";

import styles from "./page.module.css";
import { Circle } from "./_components/circle";
import CustomButton from "./_components/button";
import Sidebar from "../_components/sidebar";
import IconButton from "../_components/icon.button";
import Footer from "../_components/footer";

import Layout from "../layout";

const Dashboard = () => {
  const taglines = [
    "Green March 2024",
    "Climate change effects on earth",
    "Meet other members",
  ];

  const pages = ["/events", "/forum", "/about"];

  return (
    <div>
      {/* <Layout /> */}
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
      <Footer />
    </div>
  );
};

export default Dashboard;
