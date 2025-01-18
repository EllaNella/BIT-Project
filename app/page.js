"use client";

import styles from "./dashboard/page.module.css";
import { Circle } from "./dashboard/_components/circle";

const Dashboard = () => {
  const taglines = [
    "Take action today",
    "Share your thoughts",
    "How it all started",
  ];

  const pages = ["/events", "/forum", "/about"];

  const images = [
   
    "/images/Announcement.jpg", // Second image
    "/images/Event.jpg", // First image
    "/images/Members.jpg", // Third image
  ];

  return (
    <div className={styles.main}>
      {/* Welcome Section */}
      <div className={styles.welcome}>
        <h3>It Starts With You, Prunella (Username)</h3>
        <p>
          Together, we can make a difference. Join the movement to combat
          climate change and create a sustainable future for everyone.
        </p>
        <a href="/get-started" className={styles["cta-btn"]}>
          Get Started
        </a>
      </div>

      {/* Circle Section */}
      <div className={styles.row}>
        {taglines.map((tagline, index) => (
          <Circle
            key={index}
            tagline={tagline}
            page={pages[index]}
            image={images[index]} // Pass the image source
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
