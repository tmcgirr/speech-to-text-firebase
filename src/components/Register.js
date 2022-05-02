import React, { useState } from "react";
import { auth, db } from "../firebase-config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";

import "./css/styles.css";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const registerWithEmailAndPassword = async (name, email, password) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name,
        authProvider: "local",
        email,
      });
    } catch (err) {
      console.error(err);
      alert("Error Attempting To Register");
    }
  };

  const register = () => {
    if (!name || !email || !password) alert("Please fill out all fields");
    else {
      registerWithEmailAndPassword(name, email, password);
      alert("Account Created.\nPlease log in on the next page.");
      navigate("/login");
    }
  };

  return (
    <div className="register">
      <div className="register__container">
        <input
          type="text"
          className="register__textBox"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full Name"
        />
        <input
          type="text"
          className="register__textBox"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
        />
        <input
          type="password"
          className="register__textBox"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button className="uni-btn register__btn" onClick={register}>
          Register
        </button>

        <div>
          Already have an account?{" "}
          <Link className="redirect_link" to="/login">
            Login
          </Link>{" "}
          now.
        </div>
      </div>
    </div>
  );
}
export default Register;
