import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
  const [formData, setFormData] = useState({ username: "", password: "", repeatPassword: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (formData.password !== formData.repeatPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    // console.log("Registering user:", formData.username);

    try {
      await api.post("/register/", {
        username: formData.username,
        password: formData.password,
      });
      // console.log("Registration successful. Logging in...");

      const loginResponse = await api.post("/token/", {
        username: formData.username,
        password: formData.password,
      });
      // console.log("Login successful:", data);

      localStorage.setItem("access", loginResponse.data.access);
      localStorage.setItem("refresh", loginResponse.data.refresh);
      navigate("/dashboard");

    } catch (error) {

      if (error.response) {
        if (error.response.status === 400) {
          const data = error.response.data;
          if (data.username) {
            setErrorMessage(data.username.join(" "));
          } else if (data.password) {
            setErrorMessage(data.password.join(" "));
          } else {
            setErrorMessage(data.detail || "Registration failed. Please try again.");
          }
        } else {
          setErrorMessage("An error occurred. Please try again.");
        }
      } else {
        setErrorMessage("Network error. Please check your connection.");
      };
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Register</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          name="repeatPassword"
          type="password"
          placeholder="Repeat Password"
          value={formData.repeatPassword}
          onChange={handleChange}
          style={styles.input}
        />
        {errorMessage && <p style={styles.error}>{errorMessage}</p>}
        <button type="submit" style={styles.button}>
          Register
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "400px",
    margin: "50px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#f9f9f9",
  },
  header: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "24px",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "10px",
    marginBottom: "15px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  button: {
    padding: "10px",
    fontSize: "16px",
    color: "white",
    backgroundColor: "#007BFF",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    fontSize: "14px",
    marginBottom: "15px",
    textAlign: "center",
  },
};
