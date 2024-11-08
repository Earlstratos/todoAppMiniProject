import React, { useState } from "react";
import "./signup.css";
import HeadingComp from "./HeadingComp";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [Inputs, setInputs] = useState({
    email: "",
    username: "",
    password: "",
  });

  const change = (e) => {
    const { name, value } = e.target;
    setInputs({ ...Inputs, [name]: value });
  };

  const submit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!Inputs.email || !Inputs.username || !Inputs.password) {
      alert("All fields are required.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/register",
        Inputs,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.message === "User with this email already exists") {
        alert(response.data.message);
      } else {
        alert("SignUp successful");
        setInputs({ email: "", username: "", password: "" });
        navigate("/Signin");
      }
    } catch (error) {
      if (error.response) {
        console.error("Signup failed", error.response.data);
        alert(`Error: ${error.response.data.message || "Signup failed"}`);
      } else if (error.request) {
        console.error("No response from server", error.request);
        alert("Error: No response from the server.");
      } else {
        console.error("Error", error.message);
        alert("Error: Signup request failed.");
      }
    }
  };

  return (
    <div className="signup">
      <div className="container">
        <div className="row">
          <div className="col-lg-6 column d-flex justify-content-center align-items-center">
            <div className="d-flex flex-column w-100 p-3">
              <input
                className="p-2 my-3 input-signup"
                type="email"
                name="email"
                placeholder="Enter Your Email"
                onChange={change}
                value={Inputs.email}
              />
              <input
                className="p-2 my-3 input-signup"
                type="text"
                name="username"
                placeholder="Enter Your Username"
                onChange={change}
                value={Inputs.username}
              />
              <input
                className="p-2 my-3 input-signup"
                type="password"
                name="password"
                placeholder="Enter Your Password"
                onChange={change}
                value={Inputs.password}
              />
              <button className="btn-signup p-2" onClick={submit}>
                Sign Up
              </button>
            </div>
          </div>
          <div className="col-lg-4 column col-left d-lg-flex justify-content-center align-items-center d-none">
            <HeadingComp first="Sign" second="Up" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
