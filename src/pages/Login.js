import { React, useState } from "react";
import axios from "axios";

const urlLogin = process.env.REACT_APP_API_URL + '/login';


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const handleLogin = async (e) => {
    e.preventDefault();
    const responseApi = await axios.post(urlLogin, { username, password });
    if (responseApi.data.token !== undefined) {
      localStorage.setItem('token', responseApi.data.token);
      localStorage.setItem('firstName', responseApi.data.firstName);
      localStorage.setItem('lastName', responseApi.data.lastName);
      window.location.href = '/home';
    }
    return responseApi.data;
  };



  return (
    <form onSubmit={handleLogin}>
      <h3>Sign In</h3>
      <div className="mb-3">
        <label>Email address</label>
        <input
          type="email"
          className="form-control"
          placeholder="Enter email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label>Password</label>
        <input
          type="password"
          className="form-control"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <div className="custom-control custom-checkbox">
          <input
            type="checkbox"
            className="custom-control-input"
            id="customCheck1"
          />
          <label className="custom-control-label" htmlFor="customCheck1">
            Remember me
          </label>
        </div>
      </div>
      <div className="d-grid">
        <button type="submit" className="btn btn-primary" >
          Submit
        </button>
      </div>
      <p className="forgot-password text-right">
        Forgot <a href="#">password?</a>
      </p>
    </form>
  )
};
export default Login;