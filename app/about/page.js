import React from "react";
import styles from "./page.module.css";
import Image from "next/image";
import Link from "next/link";
const About = () => {
  return (
    <div className={styles.main}>
      {/* header section with image and title */}
      <div className={styles.welcome}>
        <h3>GET TO KNOW US</h3>
     
       
      </div>
      {/* body with description*/}
      <div className={styles.body}>
        <h2>"Together we move mountain"</h2>
        <br /> 
        <p>
          Our journey began with a shared passion for addressing climate change
          and empowering eco-activists. Recognizing the need for a collaborative
          space, we created this platform to connect individuals, share ideas,
          and drive meaningful environmental action. Together, we aim to amplify
          the voices of those striving for a sustainable future.
        </p>
      </div>
      {/* Body with image */}
      <div className={styles.imgbtn}>
      

      {/* buttons to other pages */}
      <button  className={styles.buttons}>
        <Link href="/forum"> Meet Our Members</Link>
      </button>
      <div className={styles.image}>
      <Image
          className={styles.image}
          src="/images/Aboutbody.jpg" // Route of the image file
          height={300} // Desired size with correct aspect ratio
          width={500}
          alt="Your Name"
        />
      </div>
      <button className={styles.buttons}>
       <Link href="/events">Take Action Today</Link>
      </button>
      </div>

   
    </div>
  );
};

export default About;
