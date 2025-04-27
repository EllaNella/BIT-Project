"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import IconButton from "./icon.button";
import styles from "./components.module.css";
import { useRouter } from "next/navigation";
import { db, firebaseAuth } from "../../firebase"; // Import Firebase Auth
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { FaRegEnvelope } from "react-icons/fa6";



const Sidebar = ({ isOpen, onClick }) => {
  //router for navigation from one page to another
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);


   // Listen for auth state changes
   useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Fetch the user's role from Firestore using their email
        const usersCollection = collection(db, "users");
        const q = query(usersCollection, where("email", "==", currentUser.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data(); // Get the first matching document
          setUserRole(userData.role); // Set the user's role (e.g., "Moderator", "Visitor")
        } else {
          setUserRole("Visitor"); // Default role if no role is found
        }
      } else {
        setUser(null);
        setUserRole(null); // Reset role when user logs out
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await signOut(firebaseAuth);
      setUser(null);
      router.push("/login"); // Redirect to login
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
      <div className={styles.closeButton}>
        <IconButton width={24} height={24} icon="/icons/CloseButton.png" onClick={onClick} />
      </div>

      <ul className={styles.sidebarItem}>
        <li><Link href="/about">About</Link></li>
        <li><Link href="/events">Events</Link></li>
        <li><Link href="/forum">Forum</Link></li>
        <li><Link href="/contact">Contact</Link></li>
      </ul>

      <div className={styles.belowButton}>
        <ul>

      {/* check if its moderator  to show the buttons*/}
        {(userRole === "Moderator" || userRole === "Founder")  && (
          <>
            <li><Link href="/moderator" className={styles.mod}>Moderator</Link></li>
            <li 
          className={styles.loginItem} 
          onMouseEnter={(e) => e.currentTarget.classList.add(styles.showHoverText)}
          onMouseLeave={(e) => e.currentTarget.classList.remove(styles.showHoverText)}
        >
          <Link href="/moderator/messages" className={styles.loginLink} style={{marginBottom: "20px"}}>
            <div className={styles.messageIconWrapper}>
              <FaRegEnvelope className={styles.loginIcon} style={{color:"#2e2c2c"}} />
            </div>
            <span className={styles.hoverText}>Messages</span>
          </Link>
        </li>

            </>
          )}
          <li 
            className={styles.loginItem} 
            onMouseEnter={(e) => e.currentTarget.classList.add(styles.showHoverText)} //to show the effect of text on hover
            onMouseLeave={(e) => e.currentTarget.classList.remove(styles.showHoverText)}
            onClick={() => user ? handleLogout() : router.push("/login")} // Handle login/logout based on wheather the user is signed in or not
          >
            <Link href="#" className={styles.loginLink}>
              <img 
                src="/images/loginicon.png" 
                alt="Login" 
                className={styles.loginIcon}
              />
              <span className={styles.hoverText}>{user ? "Logout" : "Login"}</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
