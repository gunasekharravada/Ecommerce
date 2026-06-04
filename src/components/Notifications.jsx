import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const navigate = useNavigate();

  return (
    <div className="empty-page">
      <FaArrowLeft style={{cursor:'pointer'}} onClick={() => navigate("/Profile")} />
        <span  style={{color: '#333',fontSize: '24px', fontWeight: 'bold', marginLeft: '10px'}}>Notifications</span>
      <h2>Oops 😔</h2>
      <p>There are no notifications.</p>
    </div>
  );
};

export default Notifications;