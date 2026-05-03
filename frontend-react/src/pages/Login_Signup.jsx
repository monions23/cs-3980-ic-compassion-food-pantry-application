import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "./Layout";

import {
  login,
  signup,
  forgotPassword,
} from "../utilities/API_Files/Signup-Login-API";

export default function Login_Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [forgotPasswordSection, setForgotPasswordSection] = useState(false);

  // For messages
  const [loginMsg, setLoginMsg] = useState("");
  const [loginMsgClass, setLoginMsgClass] = useState("auth-message");
  const [signupMsg, setSignupMsg] = useState("");
  const [signupMsgClass, setSignupMsgClass] = useState("auth-message");
  const [resetPasswordMsg, setPasswordMsg] = useState("");
  const [passwordMsgColor, setPasswordMsgColor] = useState("");
  /* ==========================
  LOGIN HANDLER
``========================== */
  async function handleLogin(e) {
    e.preventDefault();
    e.stopPropagation();

    try {
      const response = await login(formData.email, formData.password);
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setLoginMsgClass("auth-message error");
        setLoginMsg(data.detail || "Signup failed");
        return;
      }

      // HARD GUARD: no token = no redirect
      if (!data.access_token) {
        console.error("No token returned:", data);
        setLoginMsgClass("auth-message error");
        setLoginMsg("Login failed (no token)");
        return;
      }

      localStorage.setItem("access_token", data.access_token);

      setLoginMsgClass("auth-message success");
      setLoginMsg("Login successful!");

      navigate("/"); // Navigate to the home page (now logged in)
    } catch (err) {
      console.error(err);
      setLoginMsgClass("auth-message error");
      setLoginMsg("Error logging in");
    }
  }

  /* ==========================
  SIGN UP HANDLER
``========================== */
  async function handleSignup() {
    try {
      const response = await signup(formData.email, formData.password);
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setSignupMsgClass("auth-message error");
        setSignupMsg(data.detail || "Signup failed");
        return;
      }

      setSignupMsg("Account created! Please sign in.");
      setSignupMsgClass("auth-message success");
    } catch (err) {
      console.error(err);
      setSignupMsgClass("auth-message error");
      setSignupMsg("Error signing up");
    }
  }

  /* ==========================
  FORGOT PASSWORD HANDLER
``========================== */
  async function handleForgotPassword() {
    try {
      const res = await forgotPassword(formData.email);
      const data = await res.json();

      if (!res.ok) {
        setPasswordMsgColor("red");
        setPasswordMsg(data.detail || "Failed to send reset link");
        return;
      }

      setPasswordMsgColor("green");
      setPasswordMsg("If that email exists, a reset link was sent.");
    } catch (err) {
      console.error(err);
      setPasswordMsgColor("red");
      setPasswordMsg("Server error");
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <div>
      <Layout>
        <div className="main-grid">
          <div className="main-structure-top">
            <h1>Sign in / Sign up</h1>
          </div>
          <div className="main-structure-left">
            <h2>Sign in</h2>
            <form id="login-form" onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <br />
                <input
                  type="text"
                  id="sign-in-email"
                  name="email"
                  placeholder="Enter Email"
                  onChange={handleChange}
                  required
                />
                <br />
              </div>
              <br />
              <div className="form-group">
                <label htmlFor="password">Password:</label>
                <br />
                <input
                  type="password"
                  id="sign-in-password"
                  name="password"
                  placeholder="Enter Password"
                  onChange={handleChange}
                  required
                />
                <br />
              </div>
              <br />
              <button type="submit">Sign In</button>
              <br />
              <p
                id="login-msg"
                className={loginMsgClass}
                style={{ marginTop: "10px" }}
              >
                {loginMsg}
              </p>
            </form>
            <div className="extra-options">
              <br />
              <a
                href="#"
                id="forgotPasswordLink"
                onClick={() => setForgotPasswordSection(!forgotPasswordSection)}
              >
                Forgot password?
              </a>

              <div
                id="forgotPasswordSection"
                style={{
                  display: forgotPasswordSection ? "block" : "none",
                  marginTop: "10px",
                }}
              >
                <h4>Reset your password</h4>

                <form id="forgot-password-form" onSubmit={handleForgotPassword}>
                  <input
                    type="email"
                    id="forgotEmail"
                    placeholder="Enter your email"
                    onChange={handleChange}
                    required
                  />
                  <button type="submit">Send Reset Link</button>
                </form>

                <p id="forgotMsg" style={{ color: passwordMsgColor }}>
                  {resetPasswordMsg}
                </p>
              </div>
            </div>
          </div>
          <div className="main-structure-right">
            <form id="signup-form" onSubmit={handleSignup}>
              <h2>Create Account</h2>
              <br />
              <label htmlFor="email">Email:</label>
              <br />
              <input
                type="email"
                id="sign-up-email"
                name="email"
                onChange={handleChange}
                required
              />
              <br />
              <br />
              <label htmlFor="password">Password:</label>
              <br />
              <input
                type="password"
                id="sign-up-password"
                name="password"
                onChange={handleChange}
                required
              />
              <br />
              <br />
              <button type="submit">Sign Up</button>
              <p
                id="signup-msg"
                className={signupMsgClass}
                style={{ marginTop: "10px" }}
              >
                {signupMsg}
              </p>
            </form>
          </div>
        </div>
      </Layout>
    </div>
  );
}
