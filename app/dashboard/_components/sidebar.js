import React from "react";
import Link from "next/link";

import styles from "../page.module.css";
const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      <ul className={styles.sidebarItem}>
        <li>
          <Link href="/about">About</Link>
        </li>
        <li>
          <Link href="/about">Events</Link>
        </li>
        <li>
          <Link href="/about">Fourm</Link>
        </li>
        <li>
          <Link href="/about">Contact</Link>
        </li>
        <li>
          <Link href="/about">Register</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
