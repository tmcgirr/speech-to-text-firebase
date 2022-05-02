import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import SpeechToText from "./components/SpeechToText";
import LoginPage from "./pages/LoginPage";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "./firebase-config";
import Register from "./components/Register";

function App() {
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth"));

  const signUserOut = () => {
    signOut(auth).then(() => {
      localStorage.clear();
      setIsAuth(false);
      window.location.pathname = "/";
    });
  };
  return (
    <Router>
      <nav>
        {!isAuth ? (
          <>
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
          </>
        ) : (
          <>
            <Link to="/">Home</Link>
            <Link to="/CreatePost">Post</Link>
            <Link to="/" onClick={signUserOut}>
              Log Out
            </Link>
          </>
        )}
      </nav>
      <Routes>
        <Route path="/" element={<Home isAuth={isAuth} />}></Route>
        <Route
          exact
          path="/register"
          element={<Register setIsAuth={setIsAuth} />}
        />
        <Route
          path="/CreatePost"
          element={<SpeechToText isAuth={isAuth} />}
        ></Route>
        <Route
          path="/login"
          element={<LoginPage setIsAuth={setIsAuth} />}
        ></Route>
      </Routes>
    </Router>
  );
}

export default App;
