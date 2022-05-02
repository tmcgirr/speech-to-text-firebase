import React from "react";
import Login from "../components/Login";
function Home({ setIsAuth }) {
  return <Login setIsAuth={setIsAuth} />;
}

export default Home;
