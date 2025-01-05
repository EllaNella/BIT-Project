import React from "react";
import styles from "./page.module.css";
import Footer from "../_components/footer";
const About = () => {
  return (
    <div>
      {/* header section with image and title */}
      <div className={styles.header}>
        <h3>GET TO KNOW US</h3>
      </div>

      {/* body with description*/}
      <div className={styles.body}>
        <h5>"Together we move mountains"</h5>
        <p>
          Our journey began with a shared passion for addressing climate change
          and empowering eco-activists. Recognizing the need for a collaborative
          space, we created this platform to connect individuals, share ideas,
          and drive meaningful environmental action. Together, we aim to amplify
          the voices of those striving for a sustainable future.
        </p>
      </div>
      {/* Body with image */}
      <div className={styles.image}>
        <p>Insert image here</p>
      </div>

      {/* buttons to other pages */}
      <button className={styles.buttons}>
        <p>Meet Our Members</p>
      </button>

      <button className={styles.buttons}>
        <p>Take Action Today</p>
      </button>

      {/* footer */}

      <Footer />
    </div>
  );
};

export default About;
