import React, { useCallback, useState } from 'react'
import { useSetRecoilState } from 'recoil'
import { userBalanceAtom } from '../Store/atoms'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useSearchParams } from 'react-router-dom'

const Send = () => {
  const setUserBalance = useSetRecoilState(userBalanceAtom);
  const [ amount, setAmount ] = useState(0);
  const navigate = useNavigate();
  const [ searchParams ] = useSearchParams();

  const id = searchParams.get("id");
  const firstName = searchParams.get("firstname");
  const lastName = searchParams.get("lastname");

  const transfer = useCallback(()=>{
    axios.post("http://localhost:3000/api/v1/account/transfer", {
      to: id,
      amount: parseInt(amount)
    }, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("userId_token")}`
      }
    }).then(()=>setUserBalance(userBalance=>userBalance-parseInt(amount)));
    
    navigate("/dashboard");
    
  }, [amount])

  return (
    <div className='w-full h-screen flex justify-center items-center bg-Gunmetal'>
      <div className='h-[325px] w-[325px] bg-gray-100 rounded-md
        shadow-lg shadow-slate-500 flex flex-col items-center'>
        <h1 className='text-3xl font-bold text-gray-800 mt-4 text-center'>Send Money</h1>
        <div className='flex justify-start items-center gap-4 mt-8 mb-6 '>          
          <div className='inline text-xl text-white font-bold px-4 py-2.5 rounded-full bg-green-400 border border-green-300 shadow-sm ml-2 cursor-pointer'>
            {firstName[0].toUpperCase()}
          </div>
          <h2 className='text-2xl text-gray-800 font-semibold'>{`${firstName} ${lastName}`}</h2>
        </div>
        <div className='flex flex-col items-center gap-2'>
          <label htmlFor="amount" className='text-lg text-gray-800' >
            Amount (in ₹)
          </label>
          <input id="amount"
          className='h-8 rounded-md shadow-inner shadow-gray-200
          outline-none px-4 w-[90%] border border-gray-300 
          focus:border-2 focus:border-green-500 group-hover:shadow-md 
          font-mono caret-red-600 text-red-700 text-center'
          onChange={e=>setAmount(e.target.value)}>
          </input>
        </div>
        <button 
        className='py-1.5 px-2 w-48 mt-4 rounded-lg bg-green-700 text-gray-200 active:translate-y-0.5 shadow-md shadow-green-300'
        onClick={transfer}>
          Transfer
        </button>
      </div>
    </div>
  )
}

export default Send
