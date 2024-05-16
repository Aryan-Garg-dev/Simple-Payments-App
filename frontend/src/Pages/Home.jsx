import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate();
  useEffect(()=>{
    localStorage.getItem("userId_token") && navigate("/dashboard");
  })

  return (
    <div className='h-screen w-full flex justify-center items-center bg-Gunmetal text-gray-200
     text-5xl font-serif cursor-pointer'
    onClick={()=>navigate("/signin")}>
      Payment
    </div>
  )
}

export default Home
