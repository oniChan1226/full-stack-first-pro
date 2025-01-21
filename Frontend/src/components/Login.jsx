import React from "react";

const Login = () => {
  return (
    <div className="bg-blue-300 p-5">
      <h2>Login</h2>

      <label htmlFor="email">Email</label>
      <input type="text" name="email" id="email" />

      <label htmlFor="password">Password</label>
      <input type="text" name="password" id="password" />
    </div>
  );
};

export default Login;
