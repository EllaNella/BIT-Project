"use client"
import React from "react";
import styles from "./page.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";

function RegisterComplete() {
  const router = useRouter();
  const continu = (event) => {
    event.preventDefault();
    router.push("/"); 
  };
  return (
    <div className={styles.main}>
      <div className={styles.box}>
        <div className={styles.image}>
          <Image
            src="/images/registerComp.png"
            alt="Tick Mark"
            width={200}
            height={200}
            className={styles.tickImage}
          />
        </div>
        <div className={styles.text}>
          <h2>Registration Successful</h2>
          <p>Welcome to the community,</p>
         <p> your account has been successfully created</p>
         <button onClick={continu} className={styles.btn}>
         Continue 
         </button>
        </div>
      </div>
    </div>
  );
}

export default RegisterComplete;
