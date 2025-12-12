import React, { useEffect, useState } from "react";
import axios from "axios";
import "./User.css";

const AdminUserDashboard = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get("http://127.0.0.1:8000/api/admin/users/", {
      //headers: { Authorization: `Bearer ${token}` },
    });

    setUsers(response.data.users);
    setStats(response.data.cards);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    const token = localStorage.getItem("token");
    await axios.delete(`http://127.0.0.1:8000/api/admin/users/${id}/delete/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchUsers();
  };

  const handleSuspend = async (id) => {
    const token = localStorage.getItem("token");
    await axios.put(`http://127.0.0.1:8000/api/admin/users/${id}/suspend/`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchUsers();
  };

  const handleUpdate = (id) => {
    alert(`Redirect to update form for user ID: ${id}`);
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-dashboard">
      <h2>User Management Dashboard</h2>

      <div className="stats-cards">
        {Object.entries(stats).map(([label, value]) => (
          <div key={label} className="card">
            <h3>{label}</h3>
            <p>{value}</p>
          </div>
        ))}
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search by username, email or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(({ id, username, email, role }) => (
            <tr key={id}>
              <td>{id}</td>
              <td>{username}</td>
              <td>{email}</td>
              <td>{role}</td>
              <td>
                <button className="action-btn update" onClick={() => handleUpdate(id)}>Update</button>
                <button className="action-btn suspend" onClick={() => handleSuspend(id)}>Suspend</button>
                <button className="action-btn delete" onClick={() => handleDelete(id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUserDashboard;
