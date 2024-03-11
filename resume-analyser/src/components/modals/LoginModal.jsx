import React, { useState } from 'react';
import '../../assests/styles/modals/loginmodal.css';

const LoginModal = ({ onClose, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!username || !password) {
      alert('Please enter username and password.');
      return;
    }
    onLogin(username, password);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="login-modal">
        <div className="modal-header">
          <h2>Login</h2>
          <button className="close-btn" onClick={onClose}>X</button>
        </div>
        <div className="modal-content">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="login-btn" onClick={handleLogin}>Login</button>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
