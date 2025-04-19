"use client";
import React, { useState } from "react";
import styles from "./page.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "../../firebase"; // Adjust path if needed

const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
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
      await signInWithEmailAndPassword(firebaseAuth, formData.email, formData.password);
      router.push("/");
    } catch (err) {
      setLoading(false);

      // Handle Firebase Auth errors gracefully
      switch (err.code) {
        case "auth/user-not-found":
        case "auth/wrong-password":
          setError("Invalid email or password. Please try again.");
          break;
        case "auth/user-disabled":
          setError("Your account has been banned. Contact support.");
          break;
        case "auth/too-many-requests":
          setError("Too many failed attempts. Try again later.");
          break;
        default:
          setError("Invalid email or password. Please try again.");
      }
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.inlog}>
        <div className={styles.leftSide}>
          <Image className={styles.image} src="/images/Login.jpg" height={400} width={800} alt="Login Image" />
        </div>
        <div className={styles.rightSide}>
          <h2>Welcome Back</h2>
          {error && <p className={styles.error}>{error}</p>}
          <form onSubmit={handleSubmit} className={styles.formContainer}>
            <div>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                className={styles.formInput}
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Password:</label>
              <input
                type="password"
                name="password"
                className={styles.formInput}
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className={styles.logInBTN} disabled={loading}>
              {loading ? <span className={styles.loader}></span> : "Sign In"}
            </button>
          </form>
          <p className={styles.signUp}>
            Not a member? <a href="/register">Join us here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
