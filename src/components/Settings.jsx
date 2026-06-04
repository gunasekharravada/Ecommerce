import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();

  return (
    <div className="settings-page">
       <FaArrowLeft style={{cursor:'pointer'}} onClick={() => navigate("/Profile")} />
             <span  style={{color: '#333',fontSize: '24px', fontWeight: 'bold', marginLeft: '10px',cursor:'pointer'}}>Settings</span>
      

      <div className="setting-card">
        Security
      </div>

      <div className="setting-card">
        Notification Preferences
      </div>

      <div className="setting-card">
        Help & Support
      </div>

    </div>
  );
};

export default Settings;