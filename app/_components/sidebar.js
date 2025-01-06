import React from "react";
import Link from "next/link";
import IconButton from "./icon.button";
import styles from "./components.module.css";

const Sidebar = ({ isOpen, onClick }) => {
  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
      <div className={styles.closeButton}>
        <IconButton
          width={24}
          height={24}
          icon="/icons/CloseButton.png"
          onClick={onClick}
        />
      </div>
      <ul className={styles.sidebarItem}>
        <li>
          <Link href="/about">About</Link>
        </li>
        <li>
          <Link href="/events">Events</Link>
        </li>
        <li>
          <Link href="/forum">Forum</Link>
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
