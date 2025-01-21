import React from 'react'

const Signup = () => {
  return (
    <div className='bg-blue-300 p-5'>
      <h2>Signup</h2>
      <form>
        <label htmlFor="name">Name</label>
        <input type="text" name="name" id="name" />
        
        <label htmlFor="email">Email</label>
        <input type="text" name="email" id="email" />

        <label htmlFor="password">Password</label>
        <input type="text" name="password" id="password" />

        <label htmlFor="avatarImage">Avatar Image</label>
        <input type="file" accept='image/*' name="avatarImage" id="avatarImage" />

      </form>
    </div>
  )
}

export default Signup