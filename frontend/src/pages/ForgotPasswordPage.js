import React, { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Reset link sent to email (dummy)");
  };

  return (
    <div className="pt-24 text-center text-white">
      <h1 className="text-3xl mb-4">Forgot Password</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
        />
        <button className="btn-primary mt-4">Send Reset Link</button>
      </form>
    </div>
  );
}