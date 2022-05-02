import React, { useEffect, useState } from "react";
import {
  query,
  collection,
  where,
  getDocs,
  deleteDoc,
  doc,
  collectionGroup,
} from "firebase/firestore";
import { auth, db } from "../firebase-config";
import "./css/styles.css";

function DisplayAllPosts({ isAuth }) {
  const [postLists, setPostLists] = useState([]);
  const postsCollectionRef = collection(db, "posts");

  useEffect(() => {
    const getPosts = async () => {
      const data = await getDocs(postsCollectionRef);
      const queryPosts = query(
        collectionGroup(db, "posts"),
        where("author.id", "==", `${auth.currentUser.uid}`)
      );
      const queryDoc = await getDocs(queryPosts);
      setPostLists(queryDoc.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deletePost = async (id) => {
    const postDoc = doc(db, "posts", id);
    await deleteDoc(postDoc);
    window.location.reload();
  };

  function directToNew() {
    window.location.pathname = "/CreatePost";
  }

  return (
    <div className="displayPosts">
      <button className="uni-btn addNew_button" onClick={directToNew}>
        Add New
      </button>
      {postLists.map((post) => {
        return (
          <div className="post" key={post.id}>
            <div className="postHeader">
              <div className="title">
                <h2> {post.title}</h2>
              </div>
              <div className="deletePost">
                <button
                  onClick={() => {
                    deletePost(post.id);
                  }}
                >
                  &#128465;
                </button>
              </div>
            </div>
            <div className="postTextContainer"> {post.postText} </div>
          </div>
        );
      })}
    </div>
  );
}

export default DisplayAllPosts;
