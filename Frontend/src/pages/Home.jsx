import React from 'react'
import {Link} from "react-router-dom"

const Home = () => {
  return (
    <div className=' flex w-[80%] mx-auto space-x-5 justify-between bg-blue-500  text-2xl  p-5'>
        <Link to={"/"}>Home</Link>
        <Link to={"/login"}>Login</Link>
        <Link to={"/signup"}>Signup</Link>
    </div>
  )
}

export default Home