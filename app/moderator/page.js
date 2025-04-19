'use client';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import styles from './page.module.css';
import { collection, doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase";

// Dynamically import the Editor component with SSR disabled
const Editor = dynamic(
  () => import('@tinymce/tinymce-react').then(mod => mod.Editor),
  { ssr: false }
);

export default function Moderator() {
  const [activeTab, setActiveTab] = useState('text'); // 'text' or 'image'
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementSubTitle, setAnnouncementSubTitle] = useState('');
  const [announcementContent, setAnnouncementContent] = useState('');
  const [announcementImage, setAnnouncementImage] = useState(null);
  const [announcementImagePreview, setAnnouncementImagePreview] = useState(null);
  const [eventContent, setEventContent] = useState('');
  const [eventBanner, setEventBanner] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [announcementMessage, setAnnouncementMessage] = useState('');
  const [eventMessage, setEventMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading state for async operations

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Clear fields when switching tabs
    setAnnouncementTitle('');
    setAnnouncementSubTitle('');
    setAnnouncementContent('');
    setAnnouncementImage(null);
    setAnnouncementImagePreview(null);
    setAnnouncementMessage('');
  };

  // Handle announcement title change
  const handleAnnouncementTitleChange = (e) => {
    setAnnouncementTitle(e.target.value);
  };

  const handleAnnouncementSubTitleChange = (e) => {
    setAnnouncementSubTitle(e.target.value);
  };

  // Handle announcement content change
  const handleAnnouncementChange = (content) => {
    setAnnouncementContent(content);
  };

  // Handle announcement image upload
  const handleAnnouncementImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAnnouncementImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAnnouncementImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle event content change
  const handleEventChange = (content) => {
    setEventContent(content);
  };

  // Handle event banner upload
  const handleEventBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEventBanner(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle post announcement
  const handlePostAnnouncement = async () => {
    // Validation based on tab
    if (activeTab === 'text' && (!announcementTitle || !announcementSubTitle || !announcementContent)) {
      setAnnouncementMessage("Please fill in the title, subtitle, and content for a text announcement.");
      return;
    }
    if (activeTab === 'image' && !announcementImage) {
      setAnnouncementMessage("Please upload an image for an image announcement.");
      return;
    }

    setIsLoading(true);
    setAnnouncementMessage('');

    try {
      const announcementId = `Announcement-${Date.now()}`;
      let imageUrl = null;

      // Handle image upload for image announcements
      if (activeTab === 'image') {
        const imageRef = ref(storage, `announcements/${announcementId}`);
        await uploadBytes(imageRef, announcementImage);
        imageUrl = await getDownloadURL(imageRef);
      }

      // Create the announcement object based on type
      const newAnnouncement = activeTab === 'text' ? {
        id: announcementId,
        title: announcementTitle,
        subtitle: announcementSubTitle,
        content: announcementContent,
        createdAt: new Date().toISOString(),
      } : {
        id: announcementId,
        image: imageUrl,
        createdAt: new Date().toISOString(),
      };

      // Save to the appropriate Firestore collection
      const collectionName = activeTab === 'text' ? 'textAnnouncements' : 'imageAnnouncements';
      const announcementRef = doc(collection(db, collectionName), announcementId);
      await setDoc(announcementRef, newAnnouncement);

      // Clear the form after successful submission
      setAnnouncementTitle('');
      setAnnouncementSubTitle('');
      setAnnouncementContent('');
      setAnnouncementImage(null);
      setAnnouncementImagePreview(null);
      setAnnouncementMessage(`${activeTab === 'text' ? 'Text' : 'Image'} announcement posted successfully!`);
    } catch (error) {
      console.error("Error posting announcement:", error);
      setAnnouncementMessage("An error occurred while posting the announcement. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle post event
  const handlePostEvent = async () => {
    if (!eventBanner) {
      setEventMessage("Please upload a banner for the event. A banner is mandatory.");
      return;
    }

    setIsLoading(true);
    setEventMessage('');

    try {
      const eventId = `Event-${Date.now()}`;
      let bannerUrl = null;

      // Upload the event banner to Firebase Storage
      const bannerRef = ref(storage, `events/${eventId}`);
      await uploadBytes(bannerRef, eventBanner);
      bannerUrl = await getDownloadURL(bannerRef);

      // Create the event object
      const newEvent = {
        id: eventId,
        content: eventContent || "", // Content is optional
        bannerUrl: bannerUrl,
        createdAt: new Date().toISOString(),
      };

      // Save the event to Firestore
      const eventRef = doc(collection(db, "events"), eventId);
      await setDoc(eventRef, newEvent);

      // Clear the form after successful submission
      setEventContent('');
      setEventBanner(null);
      setBannerPreview(null);
      setEventMessage("Event posted successfully!");
    } catch (error) {
      console.error("Error posting event:", error);
      setEventMessage("An error occurred while posting the event. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle cancel announcement
  const handleCancelAnnouncement = () => {
    setAnnouncementTitle('');
    setAnnouncementSubTitle('');
    setAnnouncementContent('');
    setAnnouncementImage(null);
    setAnnouncementImagePreview(null);
    setAnnouncementMessage('');
  };

  // Handle cancel event
  const handleCancelEvent = () => {
    setEventContent('');
    setEventBanner(null);
    setBannerPreview(null);
    setEventMessage('');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Moderator Dashboard</h1>

      {/* Announcement Section */}
      <div className={styles.editorContainer}>
        <h2>Create Announcement</h2>
        <div className={styles.tabs}>
          <button
            className={`${styles.tabButton} ${styles.tab1} ${activeTab === 'text' ? styles.active : ''}`}
            onClick={() => handleTabChange('text')}
          >
            <span>Text Post</span>
          </button>
          <button
            className={`${styles.tabButton} ${styles.tab2} ${activeTab === 'image' ? styles.active : ''}`}
            onClick={() => handleTabChange('image')}
          >
            <span>Image Post</span>
          </button>
        </div>
        {activeTab === 'text' ? (
          <>
            <div className={styles.formGroup}>
              <label htmlFor="announcement-title">Title:</label>
              <input
                type="text"
                id="announcement-title"
                value={announcementTitle}
                onChange={handleAnnouncementTitleChange}
                placeholder="Enter announcement title"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="announcement-subtitle">Sub Title:</label>
              <input
                type="text"
                id="announcement-subtitle"
                value={announcementSubTitle}
                onChange={handleAnnouncementSubTitleChange}
                placeholder="Enter subtitle"
                required
              />
            </div>
            <Editor
              apiKey='96hykvaanlvp39mt8lkh8ipk5zm8wsvh3uv6cakicfaeiwxl'
              init={{
                height: 400,
                menubar: true,
                plugins: [
                  'advlist', 'autolink', 'lists', 'link', 'charmap',
                  'preview', 'anchor', 'searchreplace', 'visualblocks', 'code',
                  'fullscreen', 'insertdatetime', 'media', 'table', 'code', 'help',
                  'wordcount'
                ],
                toolbar: 'undo redo | formatselect | ' +
                  'bold italic underline | alignleft aligncenter ' +
                  'alignright alignjustify | bullist numlist outdent indent | ' +
                  'forecolor backcolor | removeformat | help',
              }}
              onEditorChange={handleAnnouncementChange}
            />
          </>
        ) : (
          <div className={styles.formGroup}>
            <label htmlFor="announcement-image">Upload Announcement Image:</label>
            <input
              type="file"
              id="announcement-image"
              accept="image/*"
              onChange={handleAnnouncementImageChange}
            />
            {announcementImagePreview && (
              <div className={styles.bannerPreview}>
                <h3>Image Preview:</h3>
                <img src={announcementImagePreview} alt="Announcement Preview" className={styles.previewImage} />
              </div>
            )}
          </div>
        )}

        <div className={styles.buttonGroup}>
          <button
            className={styles.submitButton}
            onClick={handlePostAnnouncement}
            style={{ backgroundColor: activeTab === 'text' ? '#9FCFD1' : '#A4E19D' }}
            disabled={isLoading}
          >
            {isLoading ? 'Posting...' : 'Post'}
          </button>
          <button
            className={styles.cancelButton}
            onClick={handleCancelAnnouncement}
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
        <span className={styles.announcementMessage}>{announcementMessage}</span>
      </div>

      {/* Event Section */}
      <div className={styles.editorContainer}>
        <h2 style={{ marginBottom: '2rem' }}>Create Event</h2>
        <Editor
          apiKey='96hykvaanlvp39mt8lkh8ipk5zm8wsvh3uv6cakicfaeiwxl'
          init={{
            height: 400,
            menubar: true,
            plugins: [
              'advlist', 'autolink', 'lists', 'link', 'charmap',
              'preview', 'anchor', 'searchreplace', 'visualblocks', 'code',
              'fullscreen', 'insertdatetime', 'media', 'table', 'code', 'help',
              'wordcount'
            ],
            toolbar: 'undo redo | formatselect | ' +
              'bold italic underline | alignleft aligncenter ' +
              'alignright alignjustify | bullist numlist outdent indent | ' +
              'h1 h2 | forecolor backcolor | removeformat | help',
          }}
          onEditorChange={handleEventChange}
        />
        <div className={styles.buttonGroup}>
          <button
            className={styles.submitButton}
            onClick={handlePostEvent}
            disabled={isLoading}
          >
            {isLoading ? 'Posting...' : 'Post'}
          </button>
          <button
            className={styles.cancelButton}
            onClick={handleCancelEvent}
            disabled={isLoading}
          >
            Cancel
          </button>
          <label htmlFor="event-banner" className={styles.bannerButton}>
            <span>Banner</span>
            <input
              type="file"
              id="event-banner"
              accept="image/*"
              onChange={handleEventBannerChange}
              style={{ display: 'none' }}
            />
            <span className={styles.uploadIcon}>📁</span>
          </label>
        </div>
        <span className={styles.announcementMessage}>{eventMessage}</span>
        {bannerPreview && (
          <div className={styles.bannerPreview}>
            <h3>Banner Preview:</h3>
            <img src={bannerPreview} alt="Event Banner Preview" className={styles.previewImage} />
          </div>
        )}
      </div>
    </div>
  );
}