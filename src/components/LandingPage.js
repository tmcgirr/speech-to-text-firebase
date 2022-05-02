import React from "react";
import "./css/styles.css";
import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="landing_page_div">
      <h1 className="lp_title">Speech To Text Application</h1>
      <div className="lp_description">
        <p>Save your real time speech-to-text translation.</p>
      </div>
      <div>
        {" "}
        <Link className="redirect_link" to="/login">
          Login
        </Link>{" "}
        or{" "}
        <Link className="redirect_link" to="/register">
          Sign Up
        </Link>{" "}
        to start
      </div>
    </div>
  );
}

export default LandingPage;
