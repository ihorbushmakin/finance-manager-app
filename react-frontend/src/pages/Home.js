import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access") || sessionStorage.getItem("access");
    if (token) {
      setIsAuthenticated(true);
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div style={styles.container}>
      <h1>Welcome to Simple Finance Manager</h1>
      <p>Track your expenses and income easily.</p>
      <div>
        {isAuthenticated ? (
          <>
            <button onClick={() => navigate("/dashboard")} style={styles.button}>
              Dashboard
            </button>
            <button onClick={() => navigate("/categories")} style={styles.button}>
              Settings
            </button>
          </>
        ) : (
          <>
            <button onClick={() => navigate("/login")} style={styles.button}>
              Login
            </button>
            <button onClick={() => navigate("/register")} style={styles.button}>
              Register
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    padding: "100px 20px",
  },
  button: {
    margin: "10px",
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
  },
};
