"use client"
import React from "react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

const Register = () => {
  const router = useRouter(); 

  const handleSubmit = (e) => {
    e.preventDefault();
    
    router.push("/registerComplete"); 
  };
  return (
  <div className={styles.main}>
    <div className={styles.inlog}>
     
      <div className={styles.rightSide}>
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit} className={styles.formContainer}>
        <div  className={styles.form}>
          <label htmlFor="name">Name:<span className={styles.has}>*</span></label>
          <input 
          id="name"
          name="name"
          type="text"
          className={styles.formInput}
          required
          />
          </div>
          <div className={styles.form}>
          <label htmlFor="email">Email:<span className={styles.has}>*</span></label>
          <input 
          id="email"
          name="email"
          type="email"
          className={styles.formInput}
          required
          />
          </div>
          <div className={styles.form}>
            
          <label htmlFor="pass">Password:<span className={styles.has}>*</span></label>
          <input
          id="pass"
          name="pass"
          type="password"
          className={styles.formInput}
          required
          />
          </div>
          <button type="submit"  className={styles.logInBTN}>
            Sign Up
          </button>
        </form>

      </div>
    </div>
  </div>
  )
};

export default Register;
