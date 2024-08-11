import { React, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const urlLogin = process.env.REACT_APP_API_URL + '/login';


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const responseApi = await axios.post(urlLogin, { username, password });

      if (responseApi.data.token !== undefined || responseApi.data.token !== null) {
        localStorage.setItem('token', responseApi.data.token);
        localStorage.setItem('userName', responseApi.data.userName);
        window.location.href = '/home';
      }
      return responseApi.data;
    } catch (error) {
      console.log(error);
      Swal.fire(
        '¡Error!',
        error.response.data.message,
        'error'
      );
    }
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
      </div>
      <div className="d-grid">
        <button type="submit" className="btn btn-primary" >
          Submit
        </button>
      </div>
      
    </form>
  )
};
export default Login;