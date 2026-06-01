import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./signin.css";

import { auth } from "../firebase/firebaseconfig";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";

import {
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaLock,
} from "react-icons/fa";

import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
} from "firebase/auth";



function Signin() {
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =useState(false);

  const [successMessage, setSuccessMessage] = useState("");

  const [emailError, setEmailError] = useState("");

  const [passwordError, setPasswordError] = useState("");
  
  const [error, setError] = useState("");

  const googleProvider = new GoogleAuthProvider();

  const facebookProvider = new FacebookAuthProvider();

  const handleGoogleLogin = async () => {
  try {
    await signInWithPopup(
      auth,
      googleProvider
    );

    navigate("/");
  } catch (error) {
    console.log(error);

    setError(
      "Google Sign-In failed."
    );
  }
};

const handleFacebookLogin = async () => {
  try {
    await signInWithPopup(
      auth,
      facebookProvider
    );

    navigate("/");
  } catch (error) {
    console.log(error);

    setError(
      "Facebook Sign-In failed."
    );
  }
};

  const validateForm = () => {
  let isValid = true;

  setEmailError("");
  setPasswordError("");
  setError("");

// Email Required
if (!email.trim()) {
  setEmailError("Email is required");
  isValid = false;
}

// Missing @ Symbol
else if (!email.includes("@")) {
  setEmailError("Email must contain @ symbol");
  isValid = false;
}

// Missing Domain
else if (
  !email.split("@")[1] ||
  !email.split("@")[1].includes(".")
) {
  setEmailError(
    "Please enter a valid domain (example@gmail.com)"
  );
  isValid = false;
}

// Full Email Validation
else if (
  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
) {
  setEmailError(
    "Please enter a valid email address"
  );
  isValid = false;
}

if (!password.trim()) {
  setPasswordError("Password is required");
  isValid = false;
}

else if (
  isSignup &&
  password.length < 8
) {
  setPasswordError(
    "Password must be at least 8 characters long"
  );
  isValid = false;
}

return isValid;
};
  const handleAuth = async () => {
  if (!validateForm()) return;

  try {
    setError("");

    if (isSignup) {
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      setSuccessMessage(
        "Account created successfully!"
      );

      setTimeout(() => {
        setSuccessMessage("");
        navigate("/");
      }, 2000);
    } else {
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      setSuccessMessage(
        "Signed in successfully!"
      );

      setTimeout(() => {
        setSuccessMessage("");
        navigate("/");
      }, 1000);
    }
  } catch (error) {

  switch (error.code) {

    case "auth/email-already-in-use":
      setEmailError(
        "Email already registered. Please sign in / Use a different email."
      );
      break;

    case "auth/invalid-email":
      setEmailError(
        "Please enter a valid email address."
      );
      break;

    case "auth/user-not-found":
      setEmailError(
        "No account found with this email."
      );
      break;

    case "auth/wrong-password":
      setPasswordError(
        "Incorrect password."
      );
      break;

    case "auth/weak-password":
      setPasswordError(
        "Password must be at least 6 characters."
      );
      break;

    case "auth/invalid-credential":
      setError(
        "Incorrect email or password."
      );
      break;

    case "auth/network-request-failed":
      setError(
        "Network problem. Check your internet connection."
      );
      break;

    default:
      if (error.message.includes("500")) {
        setError(
          "Server Error (500). Please try again later."
        );
      } else {
        setError(
          "Something went wrong. Please try again."
        );
      }
  }
}
};
  return (
    <div className="signin-container">
      <div className="signin-card">
        <h2>
          {isSignup ? "Create Account" : "Sign in"}
        </h2>

        <p className="subtitle">
          {isSignup ? (
            <>
              Already have an account?{" "}
              <span
                className="link-text"
                onClick={() =>
                  setIsSignup(false)
                }
              >
                Sign in
              </span>
            </>
          ) : (
            <>
              New user?{" "}
              <span
                className="link-text"
                onClick={() =>
                  setIsSignup(true)
                }
              >
                Create an account
              </span>
            </>
          )}
          {successMessage && (
  <div className="success-message">
    {successMessage}
  </div>
)}
        </p>

        {/* Email */}

       <div className="input-group">
  <FaEnvelope className="input-icon" />

  <input
    type="email"
    placeholder="Email Address"
    className="input-field"
    value={email}
    onChange={(e) =>
      setEmail(e.target.value)
    }
  />
</div>

{emailError && (
  <div className="field-error">
    {emailError}
  </div>
)}
        {/* Password */}

        <div className="input-group">
          <FaLock className="input-icon" />

          <input
            type={
              showPassword
                ? "text"
                : "password"
            }
            placeholder="Password"
            className="input-field"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <span
            className="eye-icon"
            onClick={() =>
              setShowPassword(
                !showPassword
              )
            }
          >
            {showPassword ? (
              <FaEyeSlash />
            ) : (
              <FaEye />
            )}
          </span>
        </div>

        {!isSignup && (
          <p className="forgot-password">
            Forgot password?
          </p>
        )}
        {passwordError && (
            <div className="field-error">
                {passwordError}
                </div>
            )}
            {error && (
  <div className="error-message">
    {error}
  </div>
)}
        <button
          className="login-btn"
          onClick={handleAuth}
        >
          {isSignup
            ? "Create Account"
            : "Login"}
        </button>

        <div className="divider">
          <span>or</span>
        </div>

   <div className="social-login-row">
  <button
    className="social-login-btn"
    onClick={handleGoogleLogin}
  >
    <FcGoogle className="social-logo" />
    <span>Google</span>
  </button>

  <button
    className="social-login-btn"
    onClick={handleFacebookLogin}
  >
    <FaFacebook className="social-logo facebook-icon" />
    <span>Facebook</span>
  </button>
</div>
        <p className="terms">
          By signing in with an account,
          you agree to our
          <br />
          <span>Terms of Service</span>
          {" & "}
          <span>Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}
export default Signin;