"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { FaUser } from "react-icons/fa6";
import { BiCommentDetail } from "react-icons/bi";
import { FaThumbsUp, FaRegThumbsUp, FaThumbsDown, FaRegThumbsDown } from "react-icons/fa";
import { RiDeleteBack2Fill } from "react-icons/ri";
import { firebaseAuth, db } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, addDoc, updateDoc, deleteDoc, collection, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function Forum() {
  const router = useRouter();
  const [newComments, setNewComments] = useState({});
  const [postContent, setPostContent] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState({
    username: "Guest",
    userImage: "/images/Userheader.jpg",
    role: "Visitor",
    isAdmin: false,
  });
  const [loading, setLoading] = useState(true);

  // Handle post content change
  const handlePostChange = (e) => {
    setPostContent(e.target.value);
  };

  // Handle comment content change
  const handleCommentChange = (postId, value) => {
    setNewComments((prev) => ({
      ...prev,
      [postId]: value,
    }));
  };

  // Format timestamp to "time ago"
  const formatTimeAgo = (timestamp) => {
    try {
      const postDate = new Date(timestamp);
      if (isNaN(postDate.getTime())) return "Just now";
      const now = new Date();
      const diffInSeconds = Math.floor((now - postDate) / 1000);

      if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
      else if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
      else if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
      else return `${Math.floor(diffInSeconds / 86400)} days ago`;
    } catch {
      return "Just now";
    }
  };

  // Fetch user data and handle authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      if (!user) {
        setCurrentUser({
          username: "Guest",
          userImage: "/images/Userheader.jpg",
          role: "Visitor",
          isAdmin: false,
        });
        router.push("/login");
      } else {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setCurrentUser({
              username: userData.name || user.displayName || "Unknown",
              userImage: userData.profileImage || user.photoURL || "/images/Userheader.jpg",
              role: userData.role || "Member",
              isAdmin: userData.isAdmin || false,
            });
          } else {
            setCurrentUser({
              username: user.displayName || "Unknown",
              userImage: user.photoURL || "/images/Userheader.jpg",
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
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Fetch posts in real-time
  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(collection(db, "posts"), (snapshot) => {
      try {
        const fetchedPosts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        fetchedPosts.sort((a, b) => new Date(b.postDate) - new Date(a.postDate));
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Submit a new post
  const handlePostSubmit = async () => {
    if (!postContent.trim()) return;

    const newPost = {
      username: currentUser.username,
      userImage: currentUser.userImage,
      postDate: new Date().toISOString(),
      content: postContent,
      likes: 0,
      dislikes: 0,
      likedBy: [],
      dislikedBy: [],
      showComments: false,
      comments: [],
    };

    try {
      const postRef = await addDoc(collection(db, "posts"), newPost);
      setPostContent("");
    } catch (error) {
      console.error("Error posting:", error);
      alert("Failed to post. Please try again.");
    }
  };

  // Cancel post
  const handleCancel = () => {
    setPostContent("");
  };

  // Like a post
  const handleLikePost = async (postId) => {
    const postRef = doc(db, "posts", postId);
    const postDoc = await getDoc(postRef);
    if (!postDoc.exists()) return;

    const postData = postDoc.data();
    let updatedLikes = postData.likedBy || [];
    let updatedDislikes = postData.dislikedBy || [];

    if (updatedLikes.includes(currentUser.username)) {
      updatedLikes = updatedLikes.filter((user) => user !== currentUser.username);
    } else {
      updatedLikes.push(currentUser.username);
      updatedDislikes = updatedDislikes.filter((user) => user !== currentUser.username);
    }

    try {
      await updateDoc(postRef, {
        likedBy: updatedLikes,
        dislikedBy: updatedDislikes,
        likes: updatedLikes.length,
        dislikes: updatedDislikes.length,
      });
    } catch (error) {
      console.error("Error liking post:", error);
      alert("Failed to like post. Please try again.");
    }
  };

  // Dislike a post
  const handleDislikePost = async (postId) => {
    const postRef = doc(db, "posts", postId);
    const postDoc = await getDoc(postRef);
    if (!postDoc.exists()) return;

    const postData = postDoc.data();
    let updatedLikes = postData.likedBy || [];
    let updatedDislikes = postData.dislikedBy || [];

    if (updatedDislikes.includes(currentUser.username)) {
      updatedDislikes = updatedDislikes.filter((user) => user !== currentUser.username);
    } else {
      updatedDislikes.push(currentUser.username);
      updatedLikes = updatedLikes.filter((user) => user !== currentUser.username);
    }

    try {
      await updateDoc(postRef, {
        likedBy: updatedLikes,
        dislikedBy: updatedDislikes,
        likes: updatedLikes.length,
        dislikes: updatedDislikes.length,
      });
    } catch (error) {
      console.error("Error disliking post:", error);
      alert("Failed to dislike post. Please try again.");
    }
  };

  // Add a comment
  const handleAddComment = async (postId) => {
    const commentText = newComments[postId]?.trim();
    if (!commentText) return;

    const comment = {
      username: currentUser.username,
      userImage: currentUser.userImage,
      content: commentText,
      commentDate: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
      likedBy: [],
      dislikedBy: [],
    };

    try {
      const postRef = doc(db, "posts", postId);
      const postDoc = await getDoc(postRef);
      if (postDoc.exists()) {
        const postData = postDoc.data();
        const updatedComments = [...(postData.comments || []), comment];
        await updateDoc(postRef, { comments: updatedComments });
        setNewComments((prev) => ({ ...prev, [postId]: "" }));
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to add comment. Please try again.");
    }
  };

  // Toggle comments visibility
  const handleToggleComments = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, showComments: !post.showComments } : post
      )
    );
  };

  // Like a comment
  const handleLikeComment = async (postId, commentIndex) => {
    const postRef = doc(db, "posts", postId);
    const postDoc = await getDoc(postRef);
    if (!postDoc.exists()) return;

    const postData = postDoc.data();
    let updatedComments = postData.comments || [];
    if (!updatedComments[commentIndex]) return;

    let comment = updatedComments[commentIndex];
    let updatedLikes = comment.likedBy || [];
    let updatedDislikes = comment.dislikedBy || [];

    if (updatedLikes.includes(currentUser.username)) {
      updatedLikes = updatedLikes.filter((user) => user !== currentUser.username);
    } else {
      updatedLikes.push(currentUser.username);
      updatedDislikes = updatedDislikes.filter((user) => user !== currentUser.username);
    }

    comment.likedBy = updatedLikes;
    comment.dislikedBy = updatedDislikes;
    comment.likes = updatedLikes.length;
    comment.dislikes = updatedDislikes.length;
    updatedComments[commentIndex] = comment;

    try {
      await updateDoc(postRef, { comments: updatedComments });
    } catch (error) {
      console.error("Error liking comment:", error);
      alert("Failed to like comment. Please try again.");
    }
  };

  // Dislike a comment
  const handleDislikeComment = async (postId, commentIndex) => {
    const postRef = doc(db, "posts", postId);
    const postDoc = await getDoc(postRef);
    if (!postDoc.exists()) return;

    const postData = postDoc.data();
    let updatedComments = postData.comments || [];
    if (!updatedComments[commentIndex]) return;

    let comment = updatedComments[commentIndex];
    let updatedLikes = comment.likedBy || [];
    let updatedDislikes = comment.dislikedBy || [];

    if (updatedDislikes.includes(currentUser.username)) {
      updatedDislikes = updatedDislikes.filter((user) => user !== currentUser.username);
    } else {
      updatedDislikes.push(currentUser.username);
      updatedLikes = updatedLikes.filter((user) => user !== currentUser.username);
    }

    comment.likedBy = updatedLikes;
    comment.dislikedBy = updatedDislikes;
    comment.likes = updatedLikes.length;
    comment.dislikes = updatedDislikes.length;
    updatedComments[commentIndex] = comment;

    try {
      await updateDoc(postRef, { comments: updatedComments });
    } catch (error) {
      console.error("Error disliking comment:", error);
      alert("Failed to dislike comment. Please try again.");
    }
  };

  // Delete a post (from older code)
  const handleDeletePost = async (postId) => {
    console.log("Deleting post with ID:", postId); // Debugging step

    if (!postId || typeof postId !== "string") {
      console.error("Invalid postId:", postId);
      return;
    }

    try {
      const postRef = doc(db, "posts", postId);
      await deleteDoc(postRef);
      console.log("Post deleted successfully!");

      // Remove from state immediately
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post. Please try again.");
    }
  };

  // Delete a comment (from older code)
  const handleDeleteComment = async (postId, commentIndex) => {
    try {
      const postRef = doc(db, "posts", postId);
      const postDoc = await getDoc(postRef);

      if (!postDoc.exists()) return;

      const postData = postDoc.data();
      const updatedComments = [...postData.comments];
      updatedComments.splice(commentIndex, 1); // Remove the comment

      // Update Firestore
      await updateDoc(postRef, { comments: updatedComments });

      // Update Local State
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, comments: updatedComments } : post
        )
      );
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Failed to delete comment. Please try again.");
    }
  };

  return (
    <div className={styles.main}>
      {/* Left Side: Posts and Editor */}
      <div className={styles.leftSide}>
        <div className={styles.editPost}>
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
          {loading ? (
            <p>Loading posts...</p>
          ) : posts.length === 0 ? (
            <p>No posts yet. Be the first to post!</p>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                style={{
                  backgroundColor: posts.indexOf(post) % 2 === 0 ? "#B3DAA9" : "#9FCFD1",
                }}
                className={styles.post}
              >
                {/* Post Header */}
                <div className={styles.postHeader}>
                  <img src="/images/person.png" alt={post.username} className={styles.userImage} />
                  <div className={styles.userInfo1}>
                    <h3>{post.username}</h3>
                    <p>{formatTimeAgo(post.postDate)}</p>
                  </div>
                </div>

                {/* Post Content */}
                <div
  className={styles.postContent}
  dangerouslySetInnerHTML={{
    __html: post.content.replace(/\n/g, "<br>"),
  }}
></div>

                {/* Post Actions */}
                <div className={styles.postActions}>
                  <button onClick={() => handleLikePost(post.id)}>
                    {post.likedBy?.includes(currentUser.username) ? (
                      <FaThumbsUp color="black" size={20} />
                    ) : (
                      <FaRegThumbsUp size={20} />
                    )}{" "}
                    {post.likes}
                  </button>
                  <button onClick={() => handleDislikePost(post.id)}>
                    {post.dislikedBy?.includes(currentUser.username) ? (
                      <FaThumbsDown color="black" size={20} />
                    ) : (
                      <FaRegThumbsDown size={20} />
                    )}{" "}
                    {post.dislikes}
                  </button>
                  <button
                    style={{ marginLeft: "auto" }}
                    onClick={() => handleToggleComments(post.id)}
                  >
                    <BiCommentDetail size={25} />
                  </button>
                  {(currentUser.role === "Moderator" || currentUser.role === "Founder") && (
                    <button onClick={() => handleDeletePost(post.id)}>
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
                        value={newComments[post.id] || ""}
                        onChange={(e) => handleCommentChange(post.id, e.target.value)}
                      />
                      <button
                        className={styles.commentSubmit}
                        onClick={() => handleAddComment(post.id)}
                      >
                        Post
                      </button>
                    </div>

                    {/* Existing Comments */}
                    {post.comments?.map((comment, commentIndex) => (
                      <div key={commentIndex} className={styles.comment}>
                        {(currentUser.role === "Moderator" || currentUser.role === "Founder") && (
                          <button
                            className={styles.deCmt}
                            onClick={() => handleDeleteComment(post.id, commentIndex)}
                          >
                            <RiDeleteBack2Fill size={22} color="red" />
                          </button>
                        )}
                        <div className={styles.commentContent}>
                          <div className={styles.commentHeader}>
                            <h4>{comment.username}</h4>
                          </div>
                          <p className={styles.date}>{formatTimeAgo(comment.commentDate)}</p>
                          <div
  
  dangerouslySetInnerHTML={{
    __html: comment.content.replace(/\n/g, "<br>"),
  }}
></div>
                          <div className={styles.commentActions}>
                            <button onClick={() => handleLikeComment(post.id, commentIndex)}>
                              {comment.likedBy?.includes(currentUser.username) ? (
                                <FaThumbsUp color="black" size={20} />
                              ) : (
                                <FaRegThumbsUp size={20} />
                              )}{" "}
                              {comment.likes}
                            </button>
                            <button
                              onClick={() => handleDislikeComment(post.id, commentIndex)}
                            >
                              {comment.dislikedBy?.includes(currentUser.username) ? (
                                <FaThumbsDown color="black" size={20} />
                              ) : (
                                <FaRegThumbsDown size={20} />
                              )}{" "}
                              {comment.dislikes}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
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
            <h3 className={styles.username}>Welcome Back, {currentUser.username}</h3>
            <p className={styles.userRole}>{currentUser.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}