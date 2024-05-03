import { React, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [fields, setFields] = useState({ email: "", password: "" });
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    const apiURL =
      "https://cwa8ibcrci.execute-api.us-east-1.amazonaws.com/Production/LoginAuth";
    console.log("Fields State:", fields); // Debugging: log the fields object
    console.log(
      "Stringified Payload:",
      JSON.stringify({
        // Debugging: log the stringified payload
        email: fields.email,
        password: fields.password,
      })
    );

    fetch(apiURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: fields.email,
        password: fields.password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        if (data.statusCode === 200) {
          setIsAuthenticated(true);
          navigate("/main", {
            state: { username: data.body.username, email: fields.email },
          });
          // Handle successful login here (e.g., redirecting to another page)
        } else {
          alert("Login failed: " + data.body);
          setIsAuthenticated(false);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    // Copy fields.
    const temp = { email: fields.email, password: fields.password };
    temp[name] = value;
    setFields(temp);
  };

  return (
    <div>
      <h2>Login Page</h2>
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
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={fields.password}
            onChange={handleChange}
          ></input>
          <input type="submit" value="Login"></input>
        </form>
      </div>
      <br></br>
      <br></br>
      {!isAuthenticated && <div>email or password is invalid</div>}
      <Link to="/register">Register now</Link>
    </div>
  );
}

export default Login;
