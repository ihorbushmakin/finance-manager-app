import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api/axios";

export default function Navbar() {
  const [username, setUsername] = useState(null); // State to store the username
  const token = localStorage.getItem("access") || sessionStorage.getItem("access");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      api.get("user/")
        .then(res => {
          setUsername(res.data.username); // Assuming the API returns { username: "user123" }
        })
        .catch(err => {
          console.error("Failed to fetch user info: ", err);
        });
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("access");
    sessionStorage.removeItem("access");
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>
        <span role="img" aria-label="Plus Sign">&#128176;</span>{" "}
        <Link to="/" style={styles.link}>
          Finance App
        </Link>
      </div>
      <div style={styles.links}>
        {token ? (
          <>
            <span style={styles.greeting}>Hi, {username || "User"}!</span>
            <Link to="/dashboard" style={styles.link}>
              Dashboard
            </Link>
            <Link to="/categories" style={styles.link}>
              Categories
            </Link>
            <button onClick={handleLogout} style={styles.button}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>
              Login
            </Link>
            <Link to="/register" style={styles.link}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#282c34",
    padding: "10px 20px",
  },
  logo: {
    fontSize: "20px",
    color: "#61dafb",
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  link: {
    color: "#ffffff",
    textDecoration: "none",
  },
  button: {
    background: "#61dafb",
    border: "none",
    padding: "6px 12px",
    cursor: "pointer",
    borderRadius: "4px",
  },
  greeting: {
    color: "#ffffff",
    marginRight: "15px",
  },
};
