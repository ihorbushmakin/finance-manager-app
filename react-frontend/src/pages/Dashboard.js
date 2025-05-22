import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const navigate = useNavigate();

  // Fetch transactions on mount
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.get("/transactions/");
        setTransactions(Array.isArray(res.data) ? res.data : []);
        setFilteredTransactions(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        alert("Failed to load transactions: " + (error.response?.data?.detail || error.message));
      } finally {
        setLoading(false);
      }
    };
  
    fetchTransactions();
  }, [navigate]);

  // Apply filters
  useEffect(() => {
    let filtered = [...transactions];

    if (filterType !== "all") {
      filtered = filtered.filter(tx => tx.category.type === filterType);
    }

    if (filterDateFrom) {
      filtered = filtered.filter(tx => tx.date >= filterDateFrom);
    }

    if (filterDateTo) {
      filtered = filtered.filter(tx => tx.date <= filterDateTo);
    }

    setFilteredTransactions(filtered);
  }, [filterType, filterDateFrom, filterDateTo, transactions]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this transaction? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/transactions/${id}/`);
      const updated = transactions.filter(tx => tx.id !== id);
      setTransactions(updated);
      setFilteredTransactions(updated);
    } catch (error) {
      alert("Error deleting transaction: " + (error.response?.data?.detail || error.message));
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Your Transactions</h2>

      <div style={styles.filterContainer}>
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          style={styles.filterSelect}
        >
          <option value="all">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        Period from:
        <input
          type="date"
          value={filterDateFrom}
          onChange={e => setFilterDateFrom(e.target.value)}
          style={styles.filterInput}
        />
        to
        <input
          type="date"
          value={filterDateTo}
          onChange={e => setFilterDateTo(e.target.value)}
          style={styles.filterInput}
        />
      </div>

      <button style={styles.addBtn} onClick={() => navigate("/add-transaction")}>
        <span role="img" aria-label="Plus Sign">&#10133;</span> Add Transaction
      </button>

      {filteredTransactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <ul style={styles.list}>
          {filteredTransactions.map(tx => (
            <li key={tx.id} style={styles.item}>
              <span style={styles.date}>{tx.date}</span>
              <strong
                style={{
                  color: tx.category.type === "income" ? "green" : "red",
                }}
              >
                {tx.category.type === "income"
                  ? `+${Number(tx.amount).toFixed(2)} €`
                  : `-${Number(Math.abs(tx.amount)).toFixed(2)} €`}
              </strong>{" "}
              – {tx.description}{" "}
              <em>({tx.category.name})</em>
              <button
                style={styles.deleteBtn}
                onClick={() => handleDelete(tx.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "40px 20px",
    maxWidth: "800px",
    margin: "0 auto",
  },
  header: {
    textAlign: "center",
  },
  filterContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
    flexWrap: "wrap",
    gap: "10px",
  },
  filterSelect: {
    padding: "10px",
    fontSize: "16px",
  },
  filterInput: {
    padding: "10px",
    fontSize: "16px",
  },
  addBtn: {
    marginBottom: "20px",
    padding: "10px 15px",
    cursor: "pointer",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  item: {
    padding: "10px",
    borderBottom: "1px solid #ccc",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: {
    marginRight: "10px",
    fontSize: "14px",
    color: "#555",
  },
  deleteBtn: {
    padding: "5px 10px",
    fontSize: "14px",
    color: "white",
    backgroundColor: "red",
    border: "none",
    cursor: "pointer",
  },
};
