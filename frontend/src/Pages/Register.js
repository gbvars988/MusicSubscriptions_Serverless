import { React, useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [fields, setFields] = useState({
    email: "",
    user_name: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    const apiURL =
      "https://p3uvd7s0mj.execute-api.us-east-1.amazonaws.com/Production/RegisterFunction";

    fetch(apiURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: fields.email,
        user_name: fields.user_name,
        password: fields.password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        if (data.statusCode === 201) {
          alert("new user created");
          navigate("/login");
          // Handle successful login here (e.g., redirecting to another page)
        } else {
          alert("User already exists: " + data.body);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    const temp = {
      email: fields.email,
      user_name: fields.user_name,
      password: fields.password,
    };
    temp[name] = value;
    setFields(temp);
  };

  return (
    <div>
      <h2>Register Page</h2>
      <div className="loginForm">
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={fields.email}
            onChange={handleChange}
          ></input>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="user_name"
            id="user_name"
            value={fields.user_name}
            onChange={handleChange}
          ></input>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={fields.password}
            onChange={handleChange}
          ></input>
          <input type="submit" value="Register"></input>
        </form>
      </div>
    </div>
  );
}

export default Register;
