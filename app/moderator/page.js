'use client';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import styles from './page.module.css';

// Dynamically import the Editor component with SSR disabled
const Editor = dynamic(
  () => import('@tinymce/tinymce-react').then(mod => mod.Editor),
  { ssr: false }
);

export default function Moderator() {
  const [activeTab, setActiveTab] = useState('text'); // 'text' or 'image'
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementContent, setAnnouncementContent] = useState('');
  const [announcementImage, setAnnouncementImage] = useState(null);
  const [announcementImagePreview, setAnnouncementImagePreview] = useState(null);

  const [eventContent, setEventContent] = useState('');
  const [eventBanner, setEventBanner] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Handle announcement title change
  const handleAnnouncementTitleChange = (e) => {
    setAnnouncementTitle(e.target.value);
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
  const handlePostAnnouncement = () => {
    if (activeTab === 'text') {
      console.log('Text Announcement Title:', announcementTitle);
      console.log('Text Announcement Content:', announcementContent);
    } else if (activeTab === 'image') {
      console.log('Image Announcement Image:', announcementImage);
    }
    // Add logic to post the announcement
  };

  // Handle cancel announcement
  const handleCancelAnnouncement = () => {
    setAnnouncementTitle('');
    setAnnouncementContent('');
    setAnnouncementImage(null);
    setAnnouncementImagePreview(null);
  };

  // Handle post event
  const handlePostEvent = () => {
    console.log('Event Content:', eventContent);
    console.log('Event Banner:', eventBanner);
    // Add logic to post the event
  };

  // Handle cancel event
  const handleCancelEvent = () => {
    setEventContent('');
    setEventBanner(null);
    setBannerPreview(null);
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
              <label htmlFor="announcement-title">Announcement Title:</label>
              <input
                type="text"
                id="announcement-title"
                value={announcementTitle}
                onChange={handleAnnouncementTitleChange}
                placeholder="Enter announcement title"
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
          >
            Post
          </button>
          <button
            className={styles.cancelButton}
            onClick={handleCancelAnnouncement}
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Event Section */}
      <div className={styles.editorContainer}>
        <h2 style={{marginBottom:'2rem'}}> Create Event</h2>
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
          onEditorChange={handleEventChange}
        />
        <div className={styles.buttonGroup}>
          <button
            className={styles.submitButton}
            onClick={handlePostEvent}
          >
            Post
          </button>
          <button
            className={styles.cancelButton}
            onClick={handleCancelEvent}
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