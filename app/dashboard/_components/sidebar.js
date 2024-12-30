import React from "react";
import Link from "next/link";

import styles from "../page.module.css";
import CustomButton from "./button";
const Sidebar = ({ onClick }) => {
  return (
    <div className={styles.sidebar}>
      <ul className={styles.sidebarItem}>
        <li>
          <CustomButton title={"Close"} onClick={onClick} />
        </li>
        <li>
          <Link href="/about">About</Link>
        </li>
        <li>
          <Link href="/events">Events</Link>
        </li>
        <li>
          <Link href="/forum">Fourm</Link>
        </li>
        <li>
          <Link href="/contact">Contact</Link>
        </li>
        <li>
          <Link href="/login">Login</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
