import axios from "axios";
import React, { useState } from "react";

const Login = () => {
  const initialState = {
    email: "",
    password: "",
  };

  const [formData, setFormData] = useState(initialState);

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/users/login",
        formData, {
          withCredentials: true
        }
      );
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-blue-300 p-5">
      <h2>Login</h2>

      <form onSubmit={handleOnSubmit}>
        <label htmlFor="email">Email</label>
        <input type="text" name="email" id="email" onChange={handleTextChange}/>

        <label htmlFor="password">Password</label>
        <input type="text" name="password" id="password" onChange={handleTextChange}/>

        <button type="submit">submit</button>
      </form>
    </div>
  );
};

export default Login;
