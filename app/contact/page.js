"use client";

import React, { useState } from "react";
import styles from "./page.module.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    fName: "",
    lName: "",
    email: "",
    topic: "",
    message: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { fName, email, message } = formData;

    if (!fName || !email || !message) {
      alert("Please fill up the required fields (First Name, Email, and Message).");
      return;
    }

    // Open modal upon successful submission
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <div className={styles.main}>
      <div className={styles.welcome}>
        <h3>WE LOVE TO HEAR</h3>
        <h3>FROM YOU</h3>
      </div>
      {/* body with description */}
      <div className={styles.body}>
        <h2>Need help or have any feedback?</h2>
        <br />
        <p>PLEASE USE THE FORM BELOW TO GET IN TOUCH!</p>
      </div>

      <div className={styles.form}>
        <form onSubmit={handleSubmit} className={styles.Form}>
          <p>Name (required)</p>
          <div className={styles.rowed}>
            <div className={styles.labeled}>
              <label htmlFor="fName">First Name</label>
              <input
                type="text"
                id="fName"
                name="fName"
                value={formData.fName}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.labeled}>
              <label htmlFor="lName">Last Name</label>
              <input
                type="text"
                id="lName"
                name="lName"
                value={formData.lName}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className={styles.row}>
            <label htmlFor="email" className={styles.required}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.row}>
            <label htmlFor="topic">Topic</label>
            <input
              type="text"
              id="topic"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
            />
          </div>
          <div className={styles.row}>
            <label htmlFor="message" className={styles.required}>
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className={styles.submitBtn}>
            Submit
          </button>
        </form>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Message Submitted</h2>
            <p>Thank you for reaching out to us. We will get back to you shortly!</p>
            <button onClick={closeModal} className={styles.closeModalBtn}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contact;
