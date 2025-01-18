"use client"
import React from "react";
import styles from "./page.module.css";
import Image from "next/image";
const Login = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
  }
  return (
  <div className={styles.main}>
    <div className={styles.inlog}>
      <div className={styles.leftSide}>
        {/* <img src="../../public/images/Login.jpg" alt="image" /> */}
        <Image
          className={styles.image}
          src="/images/Login.jpg" // Use the passed image prop
          height={400} // Desired size with correct aspect ratio
          width={800}
          alt="image" // Set alt based on tagline
        />
      </div>
      <div className={styles.rightSide}>
        <h2>Welcome Back</h2>
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <div>
          <label>Email:</label>
          <input 
          type="email"
          className={styles.formInput}
          required
          />
          </div>
          <div>
            
          <label>Password:</label>
          <input
          type="password"
          className={styles.formInput}
          required
          />
          </div>
          <button type="submit" className={styles.logInBTN}>
            Sign In
          </button>
        </form>

        <p className={styles.signUp}>Not a member? <a href="/register">Join us here</a></p>
      </div>
    </div>
  </div>
  )
};

export default Login;
