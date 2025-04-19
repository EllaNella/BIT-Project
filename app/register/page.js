"use client";
import React, { useState } from "react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; // Import Firestore functions
import { firebaseAuth, db } from "../../firebase"; // Ensure Firestore is initialized in firebase.js
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";

const Register = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Step 1: Register user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, formData.email, formData.password);
      const user = userCredential.user;
      

      // Step 2: Store user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: formData.name,
        email: formData.email,
        role:'member',
        uid: user.uid, // Storing UID for reference
        createdAt: new Date(),
      });

      // Step 3: Redirect user after successful signup
      router.push("/registerComplete");
    } catch (err) {
      setLoading(false);

      // Handle Firebase Auth errors gracefully
      switch (err.code) {
        case "auth/email-already-in-use":
          setError("This email is already registered. Try logging in.");
          break;
        case "auth/weak-password":
          setError("Password should be at least 6 characters long.");
          break;
        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;
        case "auth/network-request-failed":
          setError("Network error. Please try again later.");
          break;
        default:
          setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.inlog}>
        <div className={styles.rightSide}>
          <button className={styles.backButton} onClick={() => router.back()}>
            <MdKeyboardDoubleArrowLeft className={styles.backIcon} />
          </button>
          <h2>Sign Up</h2>
          {error && <p className={styles.error}>{error}</p>}
          <form onSubmit={handleSubmit} className={styles.formContainer}>
            <div className={styles.form}>
              <label htmlFor="name">Name:<span className={styles.has}>*</span></label>
              <input 
                id="name"
                name="name"
                type="text"
                className={styles.formInput}
                required
                value={formData.name}
                onChange={handleChange}
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
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className={styles.form}>
              <label htmlFor="pass">Password:<span className={styles.has}>*</span></label>
              <input
                id="pass"
                name="password"
                type="password"
                className={styles.formInput}
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className={styles.logInBTN} disabled={loading}>
               {loading ? <span className={styles.loader}></span> : "Sign Up"}
            </button>
            
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
