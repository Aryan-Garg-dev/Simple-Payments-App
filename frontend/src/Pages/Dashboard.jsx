import React, { Suspense, memo, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useRecoilState } from 'recoil';
import { userAtom, userBalanceAtom, usersAtom } from '../Store/atoms';


const Dashboard = () => {
  const navigate = useNavigate();
  const [ user, setUser] = useRecoilState(userAtom);
  const [ userBalance, setUserBalance ] = useRecoilState(userBalanceAtom);
  const sessionId = localStorage.getItem("userId_token");
  const [ filter, setFilter ] = useState("");
  const [ users, setUsers ] = useRecoilState(usersAtom);

  useEffect(()=>{
    if (!sessionId){
      navigate("/");
    }
  }, [sessionId, navigate])

  useEffect(()=>{
    axios.get("http://localhost:3000/api/v1/user/details", {
      headers: {
        "Authorization": "Bearer " + sessionId
      }
    }).then(response=>setUser(response.data.user));
  }, [sessionId]);

  useEffect(()=>{
    axios.get("http://localhost:3000/api/v1/account/balance", {
      headers: {
        "Authorization": "Bearer " + sessionId
      }
    }).then(response=>setUserBalance(response.data.balance));
  }, [sessionId])

  useEffect(()=>{
    axios.get(`http://localhost:3000/api/v1/user/bulk?filter=${filter}`, {
      headers: {
        "Authorization": "Bearer " + sessionId
      }
    })
    .then(response=>setUsers(response.data.users))
  }, [filter])


  return (
    <div className='w-full h-screen overflow-x-hidden'>
      <section>
        <nav className='bg-gray-100 h-12 flex items-center rounded-lg mx-2 justify-between mt-2 shadow-md'>
          <h1 className='ml-5 text-xl font-bold'>
            Payments App
          </h1>
          <div className='text-md mr-5 flex items-center group'>
            <div className='group-hover:absolute'>
              Hello, {user && user.name.first}<Logo letter={user && user.name.first[0].toUpperCase()} />
            </div>
            <div className='relative invisible h-0 w-0 group-hover:visible group-hover:h-[50px] group-hover:w-[150px] top-2
             border flex flex-col justify-center items-between group-hover:bg-gray-100 rounded-xl shadow-md shadow-gray-500
             active:translate-y-0.5'>
              <div className='flex gap-2 items-center'>
                <Logo letter={user && user.name.first[0].toUpperCase()} />
                <a className='cursor-pointer text-md ml-2' onClick={()=>{
                  localStorage.removeItem("userId_token");
                  navigate("/login");
                }}>Logout</a>
              </div>
            </div>
          </div>
        </nav>
      </section>
      <section className='relative p-4'>
        <div className='ml-2 flex flex-col gap-2'>
          <div className='text-xl font-bold '>Your Balance: <span className='font-semibold'>₹{userBalance && userBalance}</span></div>
          <div className='my-2 flex flex-col gap-3'>
            <label htmlFor="search" className='text-xl font-bold'>Users</label>
            <input className='outline-none border border-gray-400 rounded-lg h-8 p-4
            caret-red-600 shadow-inner shadow-gray-200 focus:border-2 focus:border-gray-900
              font-mono hover:shadow-md text-slate-800
              placeholder:font-mono' 
             placeholder='Search users ....'
             id="search"
             onChange={e=>setFilter(e.target.value)}
             />
          </div>
          <Suspense fallback={<Loading />}>
          {user && (
            <div>
              {users?.map((reciever, index)=>{
                return (user.username != reciever.username) && (
                  <UserDiv key={index} navigate={navigate} reciever={reciever} />
                )
              })}
            </div>
          )}
          </Suspense>
        </div>
      </section>
      </div>
  )
}

export const Logo =  memo(({letter})=>(
  <div className='inline px-2.5 py-1 rounded-full bg-gray-200 border border-gray-300 shadow-sm ml-2 cursor-pointer'>
    {letter}
  </div>
))

const UserDiv = memo(({ navigate, reciever })=>{
  const firstName = reciever.name.first;
  const lastName = reciever.name.last;
  return (
    <div className='flex justify-between py-2.5 pl-3 pr-6 items-center border m-1 rounded-lg shadow-sm shadow-gray-300'>
      <div className='flex gap-3 justify-start items-center'>
        <Logo letter={firstName[0].toUpperCase()} />
        <h1 className='text-xl'>{`${firstName} ${lastName}`}</h1>
      </div>
      <button
        className='py-1.5 px-2 rounded-lg bg-gray-800 text-gray-200 active:translate-y-0.5 shadow-md shadow-gray-400'
        onClick={()=>{
          navigate(`/send?id=${reciever._id}&firstname=${firstName}&lastname=${lastName}`)
        }}>
          Send ₹
      </button>
    </div>
  )
})

const Loading = ()=>(
  <div class="border border-gray-300 shadow rounded-md p-4 w-[98%] mx-auto">
    <div class="animate-pulse flex space-x-4">
      <div class="rounded-full bg-slate-700 h-10 w-10"></div>
      <div class="flex-1 space-y-6 py-1">
        <div class="h-2 bg-slate-700 rounded"></div>
        <div class="space-y-3">
          <div class="grid grid-cols-3 gap-4">
            <div class="h-2 bg-slate-700 rounded col-span-2"></div>
            <div class="h-2 bg-slate-700 rounded col-span-1"></div>
          </div>
          <div class="h-2 bg-slate-700 rounded"></div>
        </div>
      </div>
    </div>
  </div>
)

export default Dashboard
