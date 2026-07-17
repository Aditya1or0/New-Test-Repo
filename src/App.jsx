import React, { useState, useEffect, useMemo, useCallback } from "react";
import "./App.css";

function App() {
  const [users, setUsers] = useState([
    { id: crypto.randomUUID(), name: "Alice" },
  ]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);

  /**
   * Resize Handler
   */
  const handleResize = useCallback(() => {
    // Handle resize logic if needed
  }, []);

  /**
   * Register resize listener with cleanup
   */
  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  /**
   * Fetch Users
   */
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);

      // Replace with your real API URL
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch users.");
      }

      const data = await response.json();

      setUsers(
        data.map((user) => ({
          id: String(user.id),
          name: user.name,
        }))
      );
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch only once
   */
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  /**
   * Add User
   */
  const addUser = () => {
    const newUser = {
      id: crypto.randomUUID(),
      name: `User ${users.length + 1}`,
    };

    setUsers((prev) => [...prev, newUser]);
  };

  /**
   * Delete User
   */
  const deleteUser = (userId) => {
    setUsers((prev) => prev.filter((user) => user.id !== userId));
  };

  /**
   * Search
   */
  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  /**
   * Filtered Users
   */
  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      user.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  /**
   * Expensive calculation (memoized)
   */
  const expensiveResult = useMemo(() => {
    let total = 0;

    for (let i = 0; i < 1000000; i++) {
      total += i;
    }

    return total;
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>React Dashboard</h1>

        <div style={{ marginBottom: 20 }}>
          <button onClick={() => setCount((prev) => prev + 1)}>
            Increment {count}
          </button>

          <button
            onClick={addUser}
            style={{ marginLeft: 10 }}
          >
            Add User
          </button>
        </div>

        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={handleSearch}
        />

        <div
          className="bio-section"
          style={{
            marginTop: 20,
            fontWeight: "bold",
          }}
        >
          Search: {search}
        </div>

        {loading ? (
          <p>Loading users...</p>
        ) : (
          <ul>
            {filteredUsers.length === 0 ? (
              <li>No users found.</li>
            ) : (
              filteredUsers.map((user) => (
                <li key={user.id}>
                  {user.name}

                  <button
                    style={{ marginLeft: 10 }}
                    onClick={() => deleteUser(user.id)}
                  >
                    Delete
                  </button>
                </li>
              ))
            )}
          </ul>
        )}

        <footer style={{ marginTop: 30 }}>
          <small>Computed Value: {expensiveResult}</small>
        </footer>
      </header>
    </div>
  );
}

export default App;