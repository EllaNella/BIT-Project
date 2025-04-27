"use client";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import { RiDeleteBack2Fill } from "react-icons/ri";
import { firebaseAuth, db, storage } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, orderBy, doc, deleteDoc, getDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";

const Events = () => {
  
  const [currentUser, setCurrentUser] = useState({
    username: "LoggedUser",
    userImage: "/images/Userheader.jpg",
    role: "Visitor",
    isAdmin: false,
  });
  const [loadingUser, setLoadingUser] = useState(true);
// Load everything automaticallly at the start of the page
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log("Fetched user data:", userData); // Debug log
            setCurrentUser({
              username: userData.name || "Unknown",
              userImage: userData.profileImage || "/images/Userheader.jpg",
              role: userData.role || "User",
              isAdmin: userData.isAdmin || false,
            });
          } else {
            console.log("No user document found for UID:", user.uid);
            setCurrentUser({
              username: "Unknown",
              userImage: "/images/Userheader.jpg",
              role: "User",
              isAdmin: false,
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setCurrentUser({
            username: "Unknown",
            userImage: "/images/Userheader.jpg",
            role: "User",
            isAdmin: false,
          });
        }
      } else {
        setCurrentUser({
          username: "Guest",
          userImage: "/images/Userheader.jpg",
          role: "Visitor",
          isAdmin: false,
        });
      }
      setLoadingUser(false); // Done fetching user data
    });
    return () => unsubscribe();
  }, []);

  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  
  useEffect(() => {
    // Fetch text announcements
    const fetchTextAnnouncements = async () => {
      try {
        const textQuery = query(
          collection(db, "textAnnouncements"),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(textQuery);
        return querySnapshot.docs.map((doc) => ({
          id: doc.id,
          type: "text",
          ...doc.data(),
        }));
      } catch (error) {
        console.error("Error fetching text announcements:", error);
        return [];
      }
    };

    // Fetch image announcements
    const fetchImageAnnouncements = async () => {
      try {
        const imageQuery = query(
          collection(db, "imageAnnouncements"),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(imageQuery);
        return querySnapshot.docs.map((doc) => ({
          id: doc.id,
          type: "image",
          ...doc.data(),
        }));
      } catch (error) {
        console.error("Error fetching image announcements:", error);
        return [];
      }
    };

    // Fetch events
    const fetchEvents = async () => {
      try {
        const eventsQuery = query(
          collection(db, "events"),
          orderBy("createdAt", "asc")
        );
        const querySnapshot = await getDocs(eventsQuery);
        return querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (error) {
        console.error("Error fetching events:", error);
        return [];
      }
    };

    // Combine and sort announcements, fetch events
    const fetchData = async () => {
      const textAnnouncements = await fetchTextAnnouncements();
      const imageAnnouncements = await fetchImageAnnouncements();
      const allAnnouncements = [...textAnnouncements, ...imageAnnouncements].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setAnnouncements(allAnnouncements);

      const fetchedEvents = await fetchEvents();
      setEvents(fetchedEvents);
    };

    fetchData();
  }, []);

 



  const handleDelete = async (id, type) => {
    try {
      if (type === "event") {
        // Delete event banner from storage
        const eventRef = doc(db, "events", id);
        const eventData = events.find((event) => event.id === id);
        if (eventData?.bannerUrl) {
          const bannerRef = ref(storage, `events/${id}`);
          await deleteObject(bannerRef);
        }
        // Delete event from Firestore
        await deleteDoc(eventRef);
        // this is deleting from front end state
        setEvents(events.filter((event) => event.id !== id));
      } else {
        // Delete announcement
        const collectionName = type === "text" ? "textAnnouncements" : "imageAnnouncements";
        const announcementRef = doc(db, collectionName, id);
        const announcementData = announcements.find((announcement) => announcement.id === id);
        if (announcementData?.image) {
          const imageRef = ref(storage, `${collectionName}/${id}`);
          await deleteObject(imageRef);
        }
        await deleteDoc(announcementRef);
        setAnnouncements(announcements.filter((announcement) => announcement.id !== id));
      }
      console.log(`${type === "event" ? "Event" : "Announcement"} with id ${id} deleted successfully`);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const renderDescription = (text) => {
    if (!text) return null;
    return text.split(/(\*\*.*?\*\*)/).map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
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
                    {announcement.type === "text" && (
                      <div className={styles.announcementHeader}>
                        {announcement.title && <h2>{announcement.title}</h2>}
                        {announcement.subtitle && <h3>{announcement.subtitle}</h3>}
                      </div>
                    )}
                    {announcement.image && (
                      <div className={styles.imageContainer}>
                        {(currentUser.role === "Moderator" || currentUser.role === "Founder") && (
                          <button
                            className={styles.deleteButton}
                            onClick={() => handleDelete(announcement.id, announcement.type)}
                          >
                            <RiDeleteBack2Fill />
                          </button>
                        )}
                        <img
                          src={announcement.image}
                          alt=""
                          className={styles.announcementImage}
                        />
                      </div>
                    )}
                    {announcement.content && (
                      <div className={styles.announcementDescriptionContainer}>
                        {(currentUser.role == "Moderator" || currentUser.role === "Founder") && (
                          <button
                            className={styles.deleteButton}
                            onClick={() => handleDelete(announcement.id, announcement.type)}
                          >
                            <RiDeleteBack2Fill />
                          </button>
                        )}
                        <p
                          className={styles.announcementDescription}
                          dangerouslySetInnerHTML={{ __html: announcement.content }}
                        ></p>
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
                    {announcement.type === "text" && (
                      <div className={styles.announcementHeader}>
                        {announcement.title && <h2>{announcement.title}</h2>}
                        {announcement.subtitle && <h3>{announcement.subtitle}</h3>}
                      </div>
                    )}
                    {announcement.image && (
                      <div className={styles.imageContainer}>
                        {(currentUser.role == "Moderator" || currentUser.role === "Founder") && (
                          <button
                            className={styles.deleteButton}
                            onClick={() => handleDelete(announcement.id, announcement.type)}
                          >
                            <RiDeleteBack2Fill />
                          </button>
                        )}
                        <img
                          src={announcement.image}
                          alt=""
                          className={styles.announcementImage}
                        />
                      </div>
                    )}
                    {announcement.content && (
                      <div className={styles.announcementDescriptionContainer}>
                        {(currentUser.role == "Moderator" || currentUser.role === "Founder")&& (
                          <button
                            className={styles.deleteButton}
                            onClick={() => handleDelete(announcement.id, announcement.type)}
                          >
                            <RiDeleteBack2Fill />
                          </button>
                        )}
                        <p
                          className={styles.announcementDescription}
                          dangerouslySetInnerHTML={{ __html: announcement.content }}
                        ></p>
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
                src={event.bannerUrl}
                alt="Event Banner"
                className={styles.eventImage}
              />
              <div className={styles.eventContent}>
                <div className={styles.eventHeader}>
                  {(currentUser.role == "Moderator" || currentUser.role === "Founder") && (
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDelete(event.id, "event")}
                    >
                      <RiDeleteBack2Fill />
                    </button>
                  )}
                </div>
                
                {event.content && (
                  <div
                    className={styles.eventDescription}
                    dangerouslySetInnerHTML={{ __html: event.content }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events;