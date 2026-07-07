import React from "react";
import "./UnderConstruction.css";

function UnderConstruction() {
  return (
    <div className="construction-page">

      {/* Animated Background */}
      <div className="stars"></div>
      <div className="particles">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Glass Card */}
      <div className="construction-card">

        {/* AI Robot */}
        <div className="robot">
          🤖
        </div>

        {/* Logo */}
        <h1 className="logo">
          AI <span>Hub</span>
        </h1>

        <p className="tagline">
          AI Tools • Analytics • Innovation
        </p>

        <h2 className="title">
          🚧 Under Construction
        </h2>

        <p className="description">
          We're building something amazing.
          <br />
          AI Hub is currently under development.
          <br />
          Stay tuned for our official launch.
        </p>

        {/* Email */}
        <div className="notify-box">
          <input
            type="email"
            placeholder="Enter your email"
          />

          <button>
            Notify Me
          </button>
        </div>

        <p className="launching">
          🚀 Launching Soon...
        </p>

        {/* Social Icons */}
        <div className="socials">

          <a
            href="https://github.com/vipinkaushik006/"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>

          <a
            href="https://www.linkedin.com/in/vipin-kaushik006/"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>

          <a
            href="mailto:kaushikvipin2006@gmail.com"
            target="_blank"
            rel="noreferrer"
          >
            Email
          </a>

        </div>

        <p className="copyright">
          © 2026 AI Hub. All Rights Reserved.
        </p>

      </div>

    </div>
  );
}

export default UnderConstruction;