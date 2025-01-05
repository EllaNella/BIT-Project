import React from "react";
import Link from "next/link";

import styles from "./components.module.css";
import IconButton from "./icon.button";

const Sidebar = ({ onClick }) => {
  return (
    <div className={styles.sidebar}>
      <ul className={styles.sidebarItem}>
        <li>
          <IconButton
            width={24}
            height={24}
            icon="/icons/CloseButton.png"
            onClick={onClick}
          />
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
