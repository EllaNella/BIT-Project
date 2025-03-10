import React from "react";
import styles from "./page.module.css";
import { RiDeleteBack2Fill } from "react-icons/ri";

const Events = () => {
  const announcements = [
    {
      id: 1,
      title: "📢 Monthly Eco-Challenge",
      subtitle: "January",
      description: `Join our 'Cut Your Carbon' challenge and share your simple steps to reduce your carbon footprint—bike to work, go plastic-free, or plant a tree!\n\nHow to Join:\nPost your experience in the 'Eco-Challenges' forum.\n\nTop Contributor Prize:\nThe most creative post gets featured and wins a free sustainable living guide!\n\nLet's make an impact together! 💚`,
    },
    {
      id: 2,
      image: "/images/Announcementbody.jpg",
    },
    {
      id: 3,
      title: "Community Achievement",
      subtitle: "Milestone Reached",
      description: "We've collectively planted 1000 trees this quarter! Thank you for your participation.",
    },
    {
      id: 4,
      title: "Community Achievement",
      subtitle: "Milestone Reached",
      description: "We've collectively planted 1000 trees this quarter! Thank you for your participation.",
    },
    {
      id: 5,
      image: "/images/Event.jpg", // Example of image-only announcement
    },
    // Add more announcements as needed
  ];

  const events = [
    {
      id: 1,
      image: "/images/About.jpg",
      title: "Beach Cleanup by EcoGo",
      date: "Thu, 30 Jan 2025 12:00-16:00 GMT+8",
      location: "Crawfordsburn Beach",
      price: "Free",
      contact: "EcoGo@google.com",
    },
    {
      id: 2,
      image: "/images/About.jpg",
      title: "Beach Cleanup by EcoGo",
      date: "Thu, 30 Jan 2025 12:00-16:00 GMT+8",
      location: "Crawfordsburn Beach",
      price: "Free",
      contact: "EcoGo@google.com",
    },
    {
      id: 3,
      image: "/images/About.jpg",
      title: "Beach Cleanup by EcoGo",
      date: "Thu, 30 Jan 2025 12:00-16:00 GMT+8",
      location: "Crawfordsburn Beach",
      price: "Free",
      contact: "EcoGo@google.com",
    },
  ];

  const renderDescription = (text) => {
    if (!text) return null; // Add this check for null/undefined description
    // Split text by bold markers and map through parts
    return text.split(/(\*\*.*?\*\*)/).map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        // Remove ** and render as bold
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const handleDelete = (id) => {
    // Implement delete functionality here
    console.log(`Delete announcement with id: ${id}`);
  };

  return (
    <div className={styles.main}>
      <div className={styles.announcementSection}>
        <h1>Announcements</h1>
        <div className={styles.announcementContainer}>
          <div className={styles.announcementColumn}>
            {announcements
              .filter((_, index) => index % 2 === 0)
              .map((announcement) => (
                <div key={announcement.id} className={styles.announcementBox}>
                  <div className={styles.announcementContent}>
                    {(announcement.description || announcement.subtitle) && (
                      <div className={styles.announcementHeader}>
                        {announcement.title && <h2>{announcement.title}</h2>}
                        {announcement.subtitle && <h3>{announcement.subtitle}</h3>}
                      </div>
                    )}
                    {announcement.image && (
                      <div className={styles.imageContainer}>
                        <button
                          className={styles.deleteButton}
                          
                        >
                          <RiDeleteBack2Fill />
                        </button>
                        <img
                          src={announcement.image}
                          alt=""
                          className={styles.announcementImage}
                        />
                      </div>
                    )}
                    {announcement.description && (
                      <div className={styles.announcementDescriptionContainer}>
                        <button
                          className={styles.deleteButton}
                          
                        >
                          <RiDeleteBack2Fill />
                        </button>
                        <p className={styles.announcementDescription}>
                          {renderDescription(announcement.description)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
          <div className={styles.announcementColumn}>
            {announcements
              .filter((_, index) => index % 2 === 1)
              .map((announcement) => (
                <div key={announcement.id} className={styles.announcementBox}>
                  <div className={styles.announcementContent}>
                    {(announcement.description || announcement.subtitle) && (
                      <div className={styles.announcementHeader}>
                        {announcement.title && <h2>{announcement.title}</h2>}
                        {announcement.subtitle && <h3>{announcement.subtitle}</h3>}
                      </div>
                    )}
                    {announcement.image && (
                      <div className={styles.imageContainer}>
                        <button
                          className={styles.deleteButton}
                        >
                          <RiDeleteBack2Fill />
                        </button>
                        <img
                          src={announcement.image}
                          alt=""
                          className={styles.announcementImage}
                        />
                      </div>
                    )}
                    {announcement.description && (
                      <div className={styles.announcementDescriptionContainer}>
                        <button
                          className={styles.deleteButton}
                        >
                          <RiDeleteBack2Fill />
                        </button>
                        <p className={styles.announcementDescription}>
                          {renderDescription(announcement.description)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className={styles.eventsSection}>
        <h1>Events</h1>
        <div className={styles.eventsContainer}>
          {events.map((event) => (
            <div key={event.id} className={styles.eventBox}>
              <img
                src={event.image}
                alt={event.title}
                className={styles.eventImage}
              />
              <div className={styles.eventContent}>
                <div className={styles.eventHeader}>
                  <h2>{event.title}</h2>
                  <button
                    className={styles.deleteButton}
                  >
                    <RiDeleteBack2Fill />
                  </button>
                </div>
                <p className={styles.eventDate}>{event.date}</p>
                <p>{event.location}</p>
                <p>{event.price}</p>
                <p>
                  Contact <span className={styles.eventEmail}>{event.contact}</span> to sign up today!
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events;
