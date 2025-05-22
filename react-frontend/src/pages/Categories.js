import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("income");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editType, setEditType] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("categories/");
        setCategories(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          alert("Unauthorized. Please log in again.");
          localStorage.clear();
          sessionStorage.clear();
          window.location.href = "/login";
        } else {
          console.error("Failed to fetch categories:", error);
          alert("Failed to load categories");
        }
      }
    };

    fetchCategories();
  }, []);

  const handleCreate = async () => {
    try {
      const res = await api.post("categories/", {
        name: newName,
        type: newType,
      });
      setCategories([...categories, res.data]);
      setNewName("");
      setNewType("income");
    } catch (error) {
      console.error("Error creating category:", error);
      alert("Error: " + JSON.stringify(error.response?.data || {}));
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`categories/${id}/`);
      setCategories(categories.filter((cat) => cat.id !== id));
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Error: " + JSON.stringify(error.response?.data || {}));
    }
  };

  const handleEdit = (category) => {
    setEditId(category.id);
    setEditName(category.name);
    setEditType(category.type);
  };

  const handleUpdate = async () => {
    try {
      const res = await api.put(`categories/${editId}/`, {
        name: editName,
        type: editType,
      });
      setCategories(
        categories.map((cat) => (cat.id === editId ? res.data : cat))
      );
      setEditId(null);
      setEditName("");
      setEditType("");
    } catch (error) {
      console.error("Error updating category:", error);
      alert("Error: " + JSON.stringify(error.response?.data || {}));
    }
  };

  return (
    <div style={styles.container}>
      <h2>Categories</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Type</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(categories) &&
            categories.map((cat) => (
              <tr key={cat.id}>
                <td style={styles.td}>{cat.name}</td>
                <td style={styles.td}>{cat.type}</td>
                <td style={styles.td}>
                  <button
                    onClick={() => handleEdit(cat)}
                    style={styles.editButton}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    style={styles.deleteButton}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {editId ? (
        <div>
          <h3>Edit Category</h3>
          <input
            placeholder="Edit category name"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            style={styles.input}
          />
          <select
            value={editType}
            onChange={(e) => setEditType(e.target.value)}
            style={styles.select}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <button onClick={handleUpdate} style={styles.button}>
            Update
          </button>
          <button
            onClick={() => setEditId(null)}
            style={styles.cancelButton}
          >
            Cancel
          </button>
        </div>
      ) : (
        <div>
          <h3>Add New Category</h3>
          <input
            placeholder="New category"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            style={styles.input}
          />
          <select
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            style={styles.select}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <button onClick={handleCreate} style={styles.button}>
            ➕ Create
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "40px auto",
    padding: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "20px",
  },
  th: {
    border: "1px solid #ddd",
    padding: "8px",
    textAlign: "left",
    backgroundColor: "#f2f2f2",
  },
  td: {
    border: "1px solid #ddd",
    padding: "8px",
    textAlign: "left",
  },
  input: {
    padding: "10px",
    width: "100%",
    marginTop: "10px",
    marginBottom: "10px",
    fontSize: "16px",
  },
  select: {
    padding: "10px",
    width: "100%",
    marginBottom: "10px",
    fontSize: "16px",
  },
  button: {
    padding: "10px",
    fontSize: "16px",
    cursor: "pointer",
  },
  editButton: {
    padding: "5px 10px",
    fontSize: "14px",
    color: "white",
    backgroundColor: "blue",
    border: "none",
    cursor: "pointer",
    marginRight: "5px",
  },
  deleteButton: {
    padding: "5px 10px",
    fontSize: "14px",
    color: "white",
    backgroundColor: "red",
    border: "none",
    cursor: "pointer",
  },
  cancelButton: {
    padding: "10px",
    fontSize: "16px",
    cursor: "pointer",
    backgroundColor: "gray",
    color: "white",
    border: "none",
    marginLeft: "10px",
  },
};
