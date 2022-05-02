import React, { useState } from "react";
import { auth, db } from "../firebase-config";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { query, getDocs, collection, where, addDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";

import "./css/styles.css";

function Login({ setIsAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      alert("Error Attempting To Log In");
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
      alert("Error Attempting To Log In");
    }
  };

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
          onClick={() => logInWithEmailAndPassword(email, password)}
        >
          Login
        </button>
        <button className="login-with-google-btn" onClick={signInWithGoogle}>
          Google Login
        </button>
        <div>
          Don't have an account?{" "}
          <Link className="redirect_link" to="/register">
            Register
          </Link>{" "}
          now.
        </div>
      </div>
    </div>
  );
}

export default Login;
