import React from "react";
import DisplayAllPosts from "../components/DisplayAllPosts";
import LandingPage from "../components/LandingPage";

function Home({ isAuth }) {
  return isAuth ? <DisplayAllPosts /> : <LandingPage />;
}

export default Home;
