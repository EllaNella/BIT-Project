"use client";

import { useState, useEffect } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import styles from "./page.module.css";
import React from "react";
import { db } from "@/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore"; // Import Firestore functions

const MessageList = () => {
  const [messages, setMessages] = useState([]); // State to store messages
  const [expandedMessage, setExpandedMessage] = useState(null);

  // Fetch messages from Firestore
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const messagesQuery = query(
          collection(db, "messages"),
          orderBy("timestamp", "desc") // Sort messages by timestamp in descending order
        );
        const querySnapshot = await getDocs(messagesQuery);
        const fetchedMessages = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(fetchedMessages); // Update state with sorted messages
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, []);
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp); // Convert Firestore timestamp to Date object
    return date.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const toggleExpand = (index) => {
    setExpandedMessage(expandedMessage === index ? null : index);
  };

  return (
    <div className={styles.container}>
      <div className={styles.messageList}>
        {messages.map((msg, index) => (
          <div
            key={msg.id}
            className={`${styles.messageItem} ${index % 2 === 0 ? styles.greenBlue : styles.blueGreen}`}
            onClick={() => toggleExpand(index)}
          >
            {expandedMessage === index ? (
              <div className={styles.expanded}>
                <div className={styles.messageHeader}>
                  <span className={styles.name}>
                    {msg.fName} {msg.lName || ""}
                  </span>
                  <span className={styles.dateTime}>{formatTimestamp(msg.timestamp)}</span>
                </div>
                <p className={styles.email}>
                  <strong>Email:</strong> {msg.email}
                </p>
                <div className={styles.messageBox}>
                <strong>Message:</strong>

                <div
  className={styles.message}
  dangerouslySetInnerHTML={{
    __html: msg.message.replace(/\n/g, "<br>"),
  }}
></div>
</div>

                <span className={styles.dropdown}>
                  <FaChevronUp className={styles.icon} />
                </span>
              </div>
            ) : (
              <div className={styles.collapsed}>
                <div className={styles.collapsedInfo}>
                  <span className={styles.topic}>{msg.topic}</span>
                  <span className={styles.dateTime}>{formatTimestamp(msg.timestamp)}</span>
                </div>
                <div className={styles.collapsedInfo}>
                  <span className={styles.name}>
                    {msg.fName} {msg.lName || ""}
                  </span>
                  <span className={styles.dropdown}>
                    <FaChevronDown className={styles.icon} />
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageList;