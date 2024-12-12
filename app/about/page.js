import React from "react";
import styles from "./page.module.css";

const About = () => {
  return <div>
{/* navbar */}
<div>
<div className={styles.navbar}>
        {/* <Image
          src="https://plus.unsplash.com/premium_photo-1661914978519-52a11fe159a7?q=80&w=3135&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          width={50}
          alt="App Logo"
          height={50}
        /> */}

        <p>App Logo</p>
        <p>EcoGo</p>
        <p>Icon</p>
      </div>
      
      {/* header section with image and title */}
      <div className={styles.header}>
        <h3>GET TO KNOW US</h3>
      </div>
      
      {/* body with description*/}
      <div className={styles.body}>
        <h5>"Together we move mountains"</h5>
        <p>
        Our journey began with a shared passion for addressing climate change and empowering eco-activists. Recognizing the need for a collaborative space, we created this platform to connect individuals, share ideas, and drive meaningful environmental action. Together, we aim to amplify the voices of those striving for a sustainable future.
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
        <div className={styles.footer}>
          <p>
            2024 - EcoGo, Inc. All rights reserved. Address Item 1 | Item 2 | Item
            3
          </p>
        </div>

</div>






  </div>;
};


export default About;
