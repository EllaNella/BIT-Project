"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { FaUser } from "react-icons/fa6";
import { BiCommentDetail } from "react-icons/bi";
import { FaThumbsUp, FaRegThumbsUp, FaThumbsDown, FaRegThumbsDown } from "react-icons/fa";
import { RiDeleteBack2Fill } from "react-icons/ri";




export default function Forum() {
  const [postContent, setPostContent] = useState("");
const [isPreview, setIsPreview] = useState(false);
const handlePostChange = (e) => {
  setPostContent(e.target.value);
};
  const [posts, setPosts] = useState([
    {
      username: "Ella",
      userImage: "/images/Userheader.jpg",
      postDate: "1 day ago",
      content: "Hey, I am Hamza. Welcome to my site!",
      likes: 0,
      dislikes: 0,
      liked: false,
      disliked: false,
      showComments: false,
      comments: [
        {
          username: "John",
          userImage: "/images/Userheader.jpg",
          content: "Great post, Ella!",
          likes: 0,
          dislikes: 0,
          liked: false,
          disliked: false,
        },
      ],
    },
  ]);

  const [currentUser, setCurrentUser] = useState({
    username: "LoggedUser",
    userImage: "/images/Userheader.jpg",
    isAdmin: true
  });

  const handlePostSubmit = () => {
    if (!postContent.trim()) return; // Prevent empty posts
    const newPost = {
      username: currentUser.username,
      userImage: currentUser.userImage,
      postDate: "Just now",
      content: postContent,
      likes: 0,
      dislikes: 0,
      liked: false,
      disliked: false,
      showComments: false,
      comments: [],
    };
    setPosts([newPost, ...posts]);
    setPostContent(""); // Clear the text box after posting
  };

  const handleCancel = () => {
    setPostContent(""); // Clear the text box
  };

  const handleLikePost = (index) => {
    const updatedPosts = [...posts];
    if (updatedPosts[index].liked) {
      updatedPosts[index].likes -= 1;
      updatedPosts[index].liked = false;
    } else {
      if (updatedPosts[index].disliked) {
        updatedPosts[index].dislikes -= 1;
        updatedPosts[index].disliked = false;
      }
      updatedPosts[index].likes += 1;
      updatedPosts[index].liked = true;
    }
    setPosts(updatedPosts);
  };

  const handleDislikePost = (index) => {
    const updatedPosts = [...posts];
    if (updatedPosts[index].disliked) {
      updatedPosts[index].dislikes -= 1;
      updatedPosts[index].disliked = false;
    } else {
      if (updatedPosts[index].liked) {
        updatedPosts[index].likes -= 1;
        updatedPosts[index].liked = false;
      }
      updatedPosts[index].dislikes += 1;
      updatedPosts[index].disliked = true;
    }
    setPosts(updatedPosts);
  };

  const handleToggleComments = (index) => {
    const updatedPosts = [...posts];
    updatedPosts[index].showComments = !updatedPosts[index].showComments;
    setPosts(updatedPosts);
  };

  const handleLikeComment = (postIndex, commentIndex) => {
    const updatedPosts = [...posts];
    const comment = updatedPosts[postIndex].comments[commentIndex];
    if (comment.liked) {
      comment.likes -= 1;
      comment.liked = false;
    } else {
      if (comment.disliked) {
        comment.dislikes -= 1;
        comment.disliked = false;
      }
      comment.likes += 1;
      comment.liked = true;
    }
    setPosts(updatedPosts);
  };

  const handleDislikeComment = (postIndex, commentIndex) => {
    const updatedPosts = [...posts];
    const comment = updatedPosts[postIndex].comments[commentIndex];
    if (comment.disliked) {
      comment.dislikes -= 1;
      comment.disliked = false;
    } else {
      if (comment.liked) {
        comment.likes -= 1;
        comment.liked = false;
      }
      comment.dislikes += 1;
      comment.disliked = true;
    }
    setPosts(updatedPosts);
  };

  const handleDeletePost = (index) => {
    const updatedPosts = posts.filter((_, i) => i !== index);
    setPosts(updatedPosts);
  };

  const handleDeleteComment = (postIndex, commentIndex) => {
    const updatedPosts = [...posts];
    updatedPosts[postIndex].comments = updatedPosts[postIndex].comments.filter(
      (_, i) => i !== commentIndex
    );
    setPosts(updatedPosts);
  };

  return (
    <div className={styles.main}>
      {/* Left Side: Posts and Editor */}
      <div className={styles.leftSide}>
      <div className={styles.writePost}>
          {/* Tabs for Write and Preview */}
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${!isPreview ? styles.activeTab : ""}`}
              onClick={() => setIsPreview(false)}
            >
              Write
            </button>
            <button
              className={`${styles.tab} ${isPreview ? styles.activeTab : ""}`}
              onClick={() => setIsPreview(true)}
            >
              Preview
            </button>
          </div>

          {/* Content Area */}
          <div className={styles.contentArea}>
            {!isPreview ? (
              <textarea
                className={styles.textArea}
                placeholder="Write your post here..."
                value={postContent}
                onChange={handlePostChange}
              />
            ) : (
              <div className={styles.preview}>
                {postContent || "Nothing to preview..."}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className={styles.buttons}>
            <button className={styles.cancelButton} onClick={handleCancel}>
              Cancel
            </button>
            <button className={styles.postButton} onClick={handlePostSubmit}>
              Post
            </button>
          </div>
        </div>

  
        <div className={styles.postsContainer}>
          {posts.map((post, postIndex) => (
            <div key={postIndex} style={{
              backgroundColor: postIndex % 2 === 0 ? "#B3DAA9" : "#9FCFD1",
            }} className={styles.post}>
              {/* Post Header */}
              <div className={styles.postHeader}>
                <img src="/images/person.png" alt={post.username} className={styles.userImage} />
                <div className={styles.userInfo1}>
                  <h3>{post.username}</h3>
                  <p>{post.postDate}</p>
                </div>
              </div>

              {/* Post Content */}
              <div className={styles.postContent}>{post.content}</div>

              {/* Post Actions */}
              <div className={styles.postActions}>
                <button onClick={() => handleLikePost(postIndex)}>{post.liked ? <FaThumbsUp color="black" size={20} /> : <FaRegThumbsUp size={20} />} {post.likes}</button>
                <button onClick={() => handleDislikePost(postIndex)}> {post.disliked ? <FaThumbsDown color="black" size={20} /> : <FaRegThumbsDown size={20} />} {post.dislikes}</button>
                <button style={{marginLeft:'auto'}} onClick={() => handleToggleComments(postIndex)}><BiCommentDetail size={25} /> </button>
                {currentUser.isAdmin && (
                  <button onClick={() => handleDeletePost(postIndex)}>
                    <RiDeleteBack2Fill size={23} color="red" />
                  </button>
                )}
              </div>

              {/* Comments Section */}
              {post.showComments && (
                <div className={styles.commentsSection}>
                  {/* Add New Comment */}
                  <div className={styles.commentText}>
                  <textarea
                    placeholder="Write a comment..."
                    className={styles.commentInput}
                    rows={5}
                  ></textarea>
                  <button className={styles.commentSubmit}>Post</button>
                  </div>

                  {/* Existing Comments */}
                  {post.comments.map((comment, commentIndex) => (
                    <div key={commentIndex} className={styles.comment}>
                   {currentUser.isAdmin && (
                            <button className={styles.deCmt} onClick={() => handleDeleteComment(postIndex, commentIndex)}>
                              <RiDeleteBack2Fill size={22} color="red" />
                            </button>
                          )}
                      <div className={styles.commentContent}>
                        <div className={styles.commentHeader}>
                        <h4>{comment.username}</h4>
                        
                          </div>
                        <p className={styles.date}>{post.postDate}</p>
                        <p>{comment.content}</p>
                        <div className={styles.commentActions}>
                          <button onClick={() => handleLikeComment(postIndex, commentIndex)}>
                          {comment.liked ? <FaThumbsUp color="black" size={20} /> : <FaRegThumbsUp size={20} />} {comment.likes}
                          </button>
                          <button onClick={() => handleDislikeComment(postIndex, commentIndex)}>
                          {comment.disliked ? <FaThumbsDown color="black" size={20} /> : <FaRegThumbsDown size={20} />} {comment.dislikes}
                          </button>
                        
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

       {/* Right Side: Logged-in User */}
       <div className={styles.rightSide}>
        <div className={styles.userCard}>
          <div className={styles.userBackground}>
            <img
              src="/images/Userheader.jpg"
              alt="Background"
              className={styles.backgroundImage}
            />
          </div>
          <div className={styles.userInfo}>
            <FaUser size={100} className={styles.userIcon} />
            <h3 className={styles.username}>Welcome Back, User</h3>
            <p className={styles.userRole}>Founder</p>
          </div>
        </div>
      </div>
    </div>
  );
}
