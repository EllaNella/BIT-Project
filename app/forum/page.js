"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { FaUser } from "react-icons/fa6";
import { BiCommentDetail } from "react-icons/bi";
import { FaThumbsUp, FaRegThumbsUp, FaThumbsDown, FaRegThumbsDown } from "react-icons/fa";
import { RiDeleteBack2Fill } from "react-icons/ri";
import { firebaseAuth, db } from "../../firebase"; // Import Firebase
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation"; 
import { collection, addDoc, getDocs, updateDoc, deleteDoc} from "firebase/firestore";



export default function Forum() {
  const router = useRouter();
  const [newComments, setNewComments] = useState({});

  const [postContent, setPostContent] = useState("");
const [isPreview, setIsPreview] = useState(false);
const handlePostChange = (e) => {
  setPostContent(e.target.value);
};

const handleCommentChange = (postId, value) => {
  setNewComments((prev) => ({
    ...prev,
    [postId]: value,
  }));
};

  const [posts, setPosts] = useState([]);


  const formatTimeAgo = (timestamp) => {
    const postDate = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - postDate) / 1000);
  
    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    } else {
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    }
  };


  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "posts"));
        const fetchedPosts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        // Sort posts by date (newest first)
        fetchedPosts.sort((a, b) => new Date(b.postDate) - new Date(a.postDate));
        
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
  
    fetchPosts();
  }, []);



  const [currentUser, setCurrentUser] = useState({
    username: "LoggedUser",
    userImage: "/images/Userheader.jpg",
    isAdmin: true
  });
 const [userData, setUserData] = useState(null); // Store user details from Firestore

 useEffect(() => {
  const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
    if (!currentUser ) {
      router.push("/login"); // Redirect if user is not logged in
    } else {
      setCurrentUser(currentUser);
      
    }
  });

  return () => unsubscribe();
}, [router]);



    // Fetch logged-in user data
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
        if (user) {
          try {
            const userDoc = await getDoc(doc(db, "users", user.uid)); // Fetch user data from Firestore
            if (userDoc.exists()) {
              const userData = userDoc.data();
              setCurrentUser({
                username: userData.name || "Unknown",
                userImage: userData.profileImage || "/images/Userheader.jpg",
                role: userData.role || "User",
                isAdmin: userData.isAdmin || false,
              });
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        } else {
          setCurrentUser({
            username: "Guest",
            userImage: "/images/Userheader.jpg",
            role: "Visitor",
            isAdmin: false,
          });
        }
      });
      return () => unsubscribe();
    }, []);
  



    const handlePostSubmit = async () => {
      if (!postContent.trim()) return;
      const customPostId = `Post${posts.length + 1}`;
    
      const newPost = {
        id: customPostId, // Use the custom post ID
        username: currentUser.username,
        userImage: currentUser.userImage,
        postDate: new Date().toISOString(), // Save as ISO string for proper date handling
        content: postContent,
        likes: 0,
        dislikes: 0,
        likedBy: [],
        dislikedBy: [],
        showComments: false,
        comments: [],
      };
    
  try {
    // Add the post to Firestore with the custom ID
    const postRef = doc(db, "posts", customPostId);
    await setDoc(postRef, newPost); // Use setDoc instead of addDoc for custom IDs

    // Update local state
    setPosts([newPost, ...posts]);
    setPostContent(""); // Clear the text box
  } catch (error) {
    console.error("Error posting:", error);
  }
};
    

    
  const handleCancel = () => {
    setPostContent(""); // Clear the text box
  };

  const handleLikePost = async (postId) => {
    const postRef = doc(db, "posts", postId);
    const postDoc = await getDoc(postRef);
    if (!postDoc.exists()) return;
  
    const postData = postDoc.data();
    let updatedLikes = postData.likedBy || [];
    let updatedDislikes = postData.dislikedBy || [];
  
    // Check if the user already liked the post
    if (updatedLikes.includes(currentUser.username)) {
      updatedLikes = updatedLikes.filter((user) => user !== currentUser.username);
    } else {
      updatedLikes.push(currentUser.username);
      updatedDislikes = updatedDislikes.filter((user) => user !== currentUser.username); // Remove from dislikes
    }
  
    // Update Firestore
    await updateDoc(postRef, {
      likedBy: updatedLikes,
      dislikedBy: updatedDislikes,
      likes: updatedLikes.length,
      dislikes: updatedDislikes.length,
    });
  
    // Update Local State
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, likedBy: updatedLikes, dislikedBy: updatedDislikes, likes: updatedLikes.length, dislikes: updatedDislikes.length } : post
      )
    );
  };

  const handleDislikePost = async (postId) => {
    const postRef = doc(db, "posts", postId);
    const postDoc = await getDoc(postRef);
    if (!postDoc.exists()) return;
  
    const postData = postDoc.data();
    let updatedLikes = postData.likedBy || [];
    let updatedDislikes = postData.dislikedBy || [];
  
    // Check if the user already disliked the post
    if (updatedDislikes.includes(currentUser.username)) {
      updatedDislikes = updatedDislikes.filter((user) => user !== currentUser.username);
    } else {
      updatedDislikes.push(currentUser.username);
      updatedLikes = updatedLikes.filter((user) => user !== currentUser.username); // Remove from likes
    }
  
    // Update Firestore
    await updateDoc(postRef, {
      likedBy: updatedLikes,
      dislikedBy: updatedDislikes,
      likes: updatedLikes.length,
      dislikes: updatedDislikes.length,
    });
  
    // Update Local State
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, likedBy: updatedLikes, dislikedBy: updatedDislikes, likes: updatedLikes.length, dislikes: updatedDislikes.length } : post
      )
    );
  };
  


  const handleAddComment = async (postId) => {
    const commentText = newComments[postId]?.trim();
    if (!commentText) return; // Prevent empty comments
  
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
  
        // Update UI
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId ? { ...post, comments: updatedComments } : post
          )
        );
  
        setNewComments((prev) => ({
          ...prev,
          [postId]: "",
        }));
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };



  const handleToggleComments = (index) => {
    const updatedPosts = [...posts];
    updatedPosts[index].showComments = !updatedPosts[index].showComments;
    setPosts(updatedPosts);
  };

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
  
    await updateDoc(postRef, { comments: updatedComments });
  
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, comments: updatedComments } : post
      )
    );
  };
  
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
  
    await updateDoc(postRef, { comments: updatedComments });
  
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, comments: updatedComments } : post
      )
    );
  };
  

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
    }
  };

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
    }
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
                  <p>{formatTimeAgo(post.postDate)}</p>

                </div>
              </div>

              {/* Post Content */}
              <div className={styles.postContent}>{post.content}</div>

              {/* Post Actions */}
              <div className={styles.postActions}>
              <button onClick={() => handleLikePost(post.id)}>
  {post.likedBy.includes(currentUser.username) ? <FaThumbsUp color="black" size={20} /> : <FaRegThumbsUp size={20} />} {post.likes}
</button>
<button onClick={() => handleDislikePost(post.id)}>
  {post.dislikedBy.includes(currentUser.username) ? <FaThumbsDown color="black" size={20} /> : <FaRegThumbsDown size={20} />} {post.dislikes}
</button>

                <button style={{marginLeft:'auto'}} onClick={() => handleToggleComments(postIndex)}><BiCommentDetail size={25} /> </button>
                {( currentUser.role === "Moderator") && (
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
></textarea>
<button
  className={styles.commentSubmit}
  onClick={() => handleAddComment(post.id)}
>
  Post
</button>
                  </div>

                  {/* Existing Comments */}
                  {post.comments.map((comment, commentIndex) => (
                    <div key={commentIndex} className={styles.comment}>
                  {( currentUser.role === "Moderator") && (
  <button className={styles.deCmt} onClick={() => handleDeleteComment(post.id, commentIndex)}>
    <RiDeleteBack2Fill size={22} color="red" />
  </button>
)}

                      <div className={styles.commentContent}>
                        <div className={styles.commentHeader}>
                        <h4>{comment.username}</h4>
                        
                          </div>
                        <p className={styles.date}>{formatTimeAgo(comment.commentDate)}</p>
                        <p>{comment.content}</p>
                        <div className={styles.commentActions}>
                        <button onClick={() => handleLikeComment(post.id, commentIndex)}>
  {comment.likedBy.includes(currentUser.username) ? <FaThumbsUp color="black" size={20} /> : <FaRegThumbsUp size={20} />} {comment.likes}
</button>

<button onClick={() => handleDislikeComment(post.id, commentIndex)}>
  {comment.dislikedBy.includes(currentUser.username) ? <FaThumbsDown color="black" size={20} /> : <FaRegThumbsDown size={20} />} {comment.dislikes}
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
            <h3 className={styles.username}>Welcome Back, {currentUser.username}</h3>
            <p className={styles.userRole}>{currentUser.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
