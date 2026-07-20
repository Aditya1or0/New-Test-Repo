import { useEffect, useState } from "react";

// ----------------------
// Client
// ----------------------
async function getUsers() {
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/users"
  );

  // BUG: No response.ok check
  return response.json();
}

// ----------------------
// Hook
// ----------------------
function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  async function loadUsers() {
    setLoading(true);

    // BUG: No try/catch
    const data = await getUsers();

    // BUG: Assumes data is always an array
    setUsers(data);

    // BUG: If request fails, loading remains true forever
    setLoading(false);
  }

  useEffect(() => {
    loadUsers();
  }, []);

  return {
    users,
    loading,
    loadUsers,
  };
}

// ----------------------
// Component
// ----------------------
function Users() {
  const { users, loading, loadUsers } = useUsers();
  const [search, setSearch] = useState("");

  // BUG: Case-sensitive search
  const filteredUsers = users.filter((user) =>
    user.name.includes(search)
  );

  return (
    <section
      style={{
        padding: "40px",
        maxWidth: "700px",
        margin: "40px auto",
      }}
    >
      <h2>Users</h2>

      <input
        type="text"
        placeholder="Search user..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "10px",
          width: "100%",
          marginBottom: "20px",
        }}
      />

      <button onClick={loadUsers}>Reload Users</button>

      {/* BUG: Loading and users list can appear together */}
      {loading && <p>Loading...</p>}

      <ul>
        {/* BUG: Using index as key */}
        {filteredUsers.map((user, index) => (
          <li key={index} style={{ marginTop: "15px" }}>
            <strong>{user.name}</strong>
            <br />
            <span>{user.email}</span>
          </li>
        ))}
      </ul>

      {/* BUG: No empty state */}
    </section>
  );
}

export default Users;