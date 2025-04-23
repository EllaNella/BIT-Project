"use client";

import { useState, useEffect } from "react";
import styles from "./dashboard/page.module.css";
import { Circle } from "./dashboard/_components/circle";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { firebaseAuth, db } from "../firebase"; // Adjust path if needed

const Dashboard = () => {
  const [userName, setUserName] = useState(null); // State to store user's name


  // Effect to listen for ANY user is logged in or not if yes then store the user name
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      if (user) {
        // User is logged in, fetch name from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserName(userDoc.data().name);
        }
      } else {
        // User is not logged in
        setUserName(null);
      }
    });

    return () => unsubscribe(); // run the function and then unload it 
  }, []);

  // Taglines, pages, and images for the circles an array to store tag lines
  const taglines = [
    "Take action today",
    "Share your thoughts",
    "How it all started",
  ];


  // Pages for the circles an array to store links
  const pages = ["/events", "/forum", "/about"];



  // Images for the circles an array to store images
  const images = [
    "/images/Takeaction.png",
    "/images/Event.jpg",
    "/images/Members.jpg",
  ];

  return (
    <div className={styles.main}>
      {/* Welcome Section */}
      <div className={styles.welcome}>
        <h3>It Starts with You{userName ? `, ${userName}` : ""} </h3>
        <p>
          Together, we can make a difference. Join the movement to combat
          climate change and create a sustainable future for everyone.
        </p>
        <a href="/login" className={styles["cta-btn"]}>
          Get Started
        </a>
      </div>

      {/* Circle Section */}
      <div className={styles.row}>
        {taglines.map((tagline, index) => (
          // Map through taglines and create Circle components index is for unique ids of the divs
          <Circle
            key={index}
            tagline={tagline}
            page={pages[index]}
            image={images[index]}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
