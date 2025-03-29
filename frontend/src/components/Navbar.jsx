
import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav style={{ padding: "15px", background: "#333", color: "#fff" }}>
      <ul style={{ listStyle: "none", display: "flex", gap: "20px" }}>
        <li>
          <Link to="/dashboard" style={{ color: "#fff", textDecoration: "none" }}>Dashboard</Link>
        </li>
        <li>
          <Link to="/add-doctor" style={{ color: "#fff", textDecoration: "none" }}>Add Doctor</Link>
        </li>
        <li>
          <Link to="/doctors" style={{ color: "#fff", textDecoration: "none" }}>Doctor List</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;

