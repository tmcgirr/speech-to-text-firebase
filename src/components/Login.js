// import React, { useEffect, useState } from "react";
import React, { useState } from "react";
// import { auth, provider, db } from "../firebase-config";
import { auth, db } from "../firebase-config";
import {
  signInWithPopup,
  GoogleAuthProvider,
  // getAuth,
  signInWithEmailAndPassword,
  // createUserWithEmailAndPassword,
  // sendPasswordResetEmail,
  // signOut,
} from "firebase/auth";
import {
  // getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
} from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import { useAuthState } from "react-firebase-hooks/auth";

import "./css/styles.css";

function Login({ setIsAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  const GoogleProvider = new GoogleAuthProvider();
  const signInWithGoogle = async () => {
    try {
      async function newUser() {
        const res = await signInWithPopup(auth, GoogleProvider);
        const user = res.user;
        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        const docs = await getDocs(q);
        if (docs.docs.length === 0) {
          await addDoc(collection(db, "users"), {
            uid: user.uid,
            name: user.displayName,
            authProvider: "google",
            email: user.email,
          });
        }
      }
      newUser().then((result) => {
        localStorage.setItem("isAuth", true);
        setIsAuth(true);
        navigate("/");
      });
    } catch (err) {
      console.log(err);
      alert(err.message);
    }
  };

  const logInWithEmailAndPassword = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem("isAuth", true);
      setIsAuth(true); //added
      navigate("/"); //added
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // const registerWithEmailAndPassword = async (name, email, password) => {
  //   try {
  //     const res = await createUserWithEmailAndPassword(auth, email, password);
  //     const user = res.user;
  //     await addDoc(collection(db, "users"), {
  //       uid: user.uid,
  //       name,
  //       authProvider: "local",
  //       email,
  //     });
  //   } catch (err) {
  //     console.error(err);
  //     alert(err.message);
  //   }
  // };

  // const sendPasswordReset = async (email) => {
  //   try {
  //     await sendPasswordResetEmail(auth, email);
  //     alert("Password reset link sent!");
  //   } catch (err) {
  //     console.error(err);
  //     alert(err.message);
  //   }
  // };

  // const logout = () => {
  //   signOut(auth);
  // };

  return (
    <div className="login">
      <div className="login__container">
        <input
          type="text"
          className="login__textBox"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
        />
        <input
          type="password"
          className="login__textBox"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button
          className="uni-btn login__btn"
          // onClick={() => signInWithEmailAndPassword(email, password)}
          onClick={() => logInWithEmailAndPassword(email, password)}
        >
          Login
        </button>
        {/* <button className="login__btn login__google" onClick={signInWithGoogle}> */}
        <button className="login-with-google-btn" onClick={signInWithGoogle}>
          Google Login
        </button>
        {/* <div>
          <Link to="/reset">Forgot Password</Link>
        </div> */}
        <div>
          Don't have an account? <Link to="/register">Register</Link> now.
        </div>
      </div>
    </div>
  );
}

export default Login;
