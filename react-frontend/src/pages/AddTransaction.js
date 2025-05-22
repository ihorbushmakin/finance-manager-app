import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function AddTransaction() {
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    category_id: "",
  });
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access") || sessionStorage.getItem("access");
    if (!token) {
      alert("You must log in first.");
      navigate("/login");
      return;
    }

    api.get("categories/")
      .then(res => {
        setCategories(Array.isArray(res.data) ? res.data : []);
      })
      .catch(err => {
        console.error("Failed to load categories: ", err);
      });
  }, [navigate]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem("access") || sessionStorage.getItem("access");

    try {
      const response = await api.post("transactions/", formData);
      if (response.status === 201) {
        navigate("/dashboard");
      } else {
        alert("Error: " + response.statusText);
      }
    } catch (error) {
      alert("Error: " + (error.response?.data?.detail || error.message));
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Add Transaction</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          name="amount"
          placeholder="Amount (€)"
          type="number"
          value={formData.amount}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <select
          name="category_id"
          value={formData.category_id}
          onChange={handleChange}
          required
          style={styles.input}
        >
          <option value="">Select category</option>
          {Array.isArray(categories) && categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <button type="submit" style={styles.button}>
          <span role="img" aria-label="Plus Sign">&#10133;</span> Add
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    padding: "40px 20px",
    maxWidth: "500px",
    margin: "0 auto",
  },
  header: {
    textAlign: "center",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "10px",
    marginBottom: "10px",
    fontSize: "16px",
  },
  button: {
    padding: "10px",
    fontSize: "16px",
    cursor: "pointer",
  },
};
