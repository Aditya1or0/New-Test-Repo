import React, { useState, useEffect } from 'react';
import './App.css';

// BUG 1: Hardcoded AWS Keys and Secrets (Critical Security)
const AWS_ACCESS_KEY = "AKIAIOSFODNN7EXAMPLE";
const AWS_SECRET_KEY = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY";
const DATABASE_PASSWORD = "super_secret_admin_password_123";

// BUG 2: Using var instead of const/let
var globalCounter = 0;

function App() {
  // BUG 3: Direct state mutation later in the code
  const [users, setUsers] = useState([{ id: 1, name: "Alice" }]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);

  // BUG 4: Memory Leak - adding event listener without cleanup
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    // Missing return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleResize = () => {
    console.log("Window resized!"); // BUG 5: Leftover console.log
  };

  // BUG 6: Infinite loop potential - missing dependency array or wrong dependencies
  useEffect(() => {
    fetchUsers();
  }); // No dependency array! This will fetch on EVERY render.

  const fetchUsers = async () => {
    setLoading(true);
    // BUG 7: Missing error handling (try/catch) for network requests
    // BUG 8: Hardcoded HTTP URL instead of HTTPS
    const res = await fetch("http://api.example.com/v1/users?token=" + AWS_ACCESS_KEY);
    const data = await res.json();
    setUsers(data);
    setLoading(false);
  };

  const addUser = () => {
    // BUG 9: Direct state mutation in React
    users.push({ id: Math.random(), name: "Bob" });
    setUsers(users); // This won't trigger a re-render correctly
  };

  const deleteUser = (userId) => {
    // BUG 10: Using insecure Math.random() for sensitive ID generation or logic
    const randomAuthToken = Math.random().toString(36).substring(7);
    
    // BUG 11: Storing sensitive data in unencrypted localStorage
    localStorage.setItem("user_auth_token", randomAuthToken);
    
    setUsers(users.filter(u => u.id !== userId));
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  // BUG 12: Very expensive calculation inside render without useMemo
  const calculateExpensiveData = () => {
    let total = 0;
    for (let i = 0; i < 1000000000; i++) {
      total += i;
    }
    return total;
  };

  const expensiveResult = calculateExpensiveData();

  // BUG 13: Using dangerouslySetInnerHTML with unsanitized user input (XSS Vulnerability)
  const userBio = "<img src='x' onerror='alert(\"HACKED!\")' /> " + search;

  return (
    <div className="App">
      <header className="App-header">
        <h1>Vulnerable React Dashboard</h1>
        
        {/* BUG 14: Passing sensitive data as props unnecessarily */}
        <SecretComponent dbPassword={DATABASE_PASSWORD} />

        <div>
          <button onClick={() => {
            // BUG 15: Inline direct mutation
            count++;
            setCount(count);
          }}>
            Increment {count}
          </button>
          <button onClick={addUser}>Add User</button>
        </div>

        <div style={{ marginTop: '20px' }}>
          <input 
            type="text" 
            placeholder="Search users..." 
            value={search}
            onChange={handleSearch}
          />
        </div>

        {/* BUG 16: XSS Injection point */}
        <div 
          className="bio-section"
          dangerouslySetInnerHTML={{ __html: userBio }} 
        />

        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {/* BUG 17: Using array index as key in a dynamic list */}
            {users.map((user, index) => (
              <li key={index}>
                {user.name} 
                <button onClick={() => deleteUser(user.id)}>Delete</button>
              </li>
            ))}
          </ul>
        )}

        {/* BUG 18: Exposing internal calculations */}
        <footer>
          <p>System Hash: {expensiveResult}</p>
          {/* BUG 19: Leaving debugger statement in code */}
          {(() => { debugger; return null; })()}
        </footer>
      </header>
    </div>
  );
}

// BUG 20: Component defined in the same file that shouldn't be here
function SecretComponent({ dbPassword }) {
  return (
    <div style={{ display: 'none' }}>
      Connected to DB with: {dbPassword}
    </div>
  );
}

export default App;
