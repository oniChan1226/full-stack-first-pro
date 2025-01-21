import React, { useState } from 'react';
import axios from 'axios';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
  });
  const [files, setFiles] = useState({
    avatarImage: null,
    coverImage: null,
  });

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFiles((prev) => ({ ...prev, [name]: files[0] })); // Store the file object
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('fullName', formData.name);
      data.append('username', formData.username);
      data.append('email', formData.email);
      data.append('password', formData.password);
      if (files.avatarImage) data.append('avatar', files.avatarImage); // Required
      if (files.coverImage) data.append('coverImage', files.coverImage); // Optional

      const res = await axios.post('http://localhost:8000/api/v1/users/register', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Registration successful:', res.data);
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
    }
  };

  return (
    <div className="bg-blue-300 p-5">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="name"
          id="name"
          placeholder="Enter your full name"
          required
          value={formData.name}
          onChange={handleTextChange}
        />

        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Enter your username"
          required
          value={formData.username}
          onChange={handleTextChange}
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Enter your email"
          required
          value={formData.email}
          onChange={handleTextChange}
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Enter a secure password"
          required
          value={formData.password}
          onChange={handleTextChange}
        />

        <label htmlFor="avatarImage">Avatar Image</label>
        <input
          type="file"
          accept="image/*"
          name="avatarImage"
          id="avatarImage"
          required
          onChange={handleFileChange}
        />

        <label htmlFor="coverImage">Cover Image (Optional)</label>
        <input
          type="file"
          accept="image/*"
          name="coverImage"
          id="coverImage"
          onChange={handleFileChange}
        />

        <button type="submit" className="bg-blue-500 text-white p-2 mt-3">
          Register
        </button>
      </form>
    </div>
  );
};

export default Signup;
