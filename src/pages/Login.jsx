import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { toast } from "react-toastify";

const Login = () => {
  const navigaet = useNavigate()


  const handleLogin = async (e) => {
    e.preventDefault();

    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          navigaet('/');
          toast.success("login successfull");
          
        })
        .catch((error) => {
          // const errorCode = error.code;
          // const errorMessage = error.message;
          toast.error("someting is wrong while login")
        });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="title">Login</span>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="password" />
          <button type="submit">Sign in</button>
        </form>

        <p>
          You don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
