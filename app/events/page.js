import React from "react";
import Footer from "../_components/footer";
import styles from "./page.module.css"
const Events = () => {
  return (
    <div className={styles.main}>
      <div className={styles.announcement}>
        <h1>Announcements</h1>
        <div className={styles.postannoun}>
          <div>
            <h1>📢 Monthly Eco-Challenge:</h1>
            <h1>January</h1>
          </div>
          <p>

          </p>
        </div>

      </div>
      <h1>Events</h1>
      <div className={styles.events}></div>
      
    </div>
  );
};

export default Events;
