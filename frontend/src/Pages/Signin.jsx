import React, { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil';
import { firstNameAtom, lastNameAtom, emailAtom } from '../Store/atoms';
import axios from "axios"

const Signin = () => {

    const [ passwordVisibility, setPasswordVisibility ] = useState(false);
    const [ firstName, setFirstName ] = useRecoilState(firstNameAtom);
    const [ lastName, setLastName ] = useRecoilState(lastNameAtom);
    const [ email, setEmail ] = useRecoilState(emailAtom);
    const [ pass, setPass] = useState("");
    const navigate = useNavigate();

    useEffect(()=>{
        localStorage.getItem("userId_token") && navigate("/dashboard");
    }, [])

    const signIn = useCallback(async ()=>{
        try {
            const signInResponse = await axios.post("http://localhost:3000/api/v1/user/signup", {
                username: email,
                name: {
                    first: firstName,
                    last: lastName
                },
                password: pass
            })
            localStorage.setItem("userId_token", signInResponse.data.token)
            navigate("/dashboard");
        } catch(error){
            alert(error.response.data.message);
        }
    }, [firstName, lastName, email, pass]);

    return (
        <div className='bg-Gunmetal w-full h-screen flex justify-center items-center'>
        <div className='bg-whiteSmoke w-[400px] h-[525px] rounded-xl shadow-lg shadow-gray-600 p-5'>
            <div className='flex flex-col items-center gap-2 p-2'>
                <h1 className='text-4xl font-bold text-sky-950'>Sign Up</h1>
                <p className='text-lg text-center text-slate-700 text-pretty'>Enter your information to create an account</p>
            </div>
            <div className='flex flex-col justify-center p-2 gap-2'>
                <div className='flex flex-col items-start gap-1 group'>
                    <label htmlFor='first-name' className='text-gray-800 font-medium '>First Name</label>
                    <input
                    type="text"
                    id="first-name" 
                    className='input-field'
                    onChange={e=>setFirstName(e.target.value)}
                    value={firstName} />
                </div>
                <div className='flex flex-col items-start gap-1 group'>
                    <label htmlFor='last-name' className='text-gray-800 font-medium group'>
                        Last Name <div className='invisible inline text-[12px] text-slate-500 group-focus-within:visible'> (optional)</div>
                    </label>
                    <input
                    type="text"
                    id="last-name" 
                    className='input-field'
                    onChange={e=>setLastName(e.target.value)}
                    value={lastName} />
                </div>
                <div className='flex flex-col items-start gap-1 group'>
                    <label htmlFor='email' className='text-gray-800 font-medium '>Email</label>
                    <input
                    type="email"
                    id="email" 
                    className='input-field'
                    onChange={e=>setEmail(e.target.value)}
                    value={email} />
                </div>
                <div className='flex flex-col items-start gap-1 group relative'>
                    <label htmlFor='password' className='text-gray-800 font-medium '>Password</label>
                    <input
                    type={passwordVisibility?"text":"password"}
                    id="password" 
                    className='input-field disabled:opacity-50 disabled:pointer-events-none'
                    onChange={e=>setPass(e.target.value)}
                    value={pass} />
                    { pass && ( <button type="button"
                    className="absolute top-[30px] right-5 outline-none p-1.5 rounded-e-md opacity-50 active:translate-y-0.5"
                    onClick={()=>{
                        setPasswordVisibility(visibilty=>!visibilty);
                    }} >
                    { passwordVisibility
                        ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                        )
                        : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                            </svg>
                        )
                    }
                    </button>
                )}
                </div>
            </div>
            <div className='flex flex-col items-center m-2 relative'>
                <button 
                className="rounded-lg relative inline-flex group items-center justify-center px-3.5 py-1.5 m-1 cursor-pointer
                active:shadow-none bg-gradient-to-tr from-slate-600 to-slate-500 text-white border-r-2 border-b-2
                border-slate-400 active:border-0 active:translate-y-0.5"
                onClick={signIn}>
                    <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-slate-200 rounded-full
                     group-hover:w-20 group-hover:h-20 opacity-10"></span>
                    <span className="relative text-slate-100">Sign Up</span>
                </button>
                <p className='absolute top-12 text-slate-800'>Already have an account? <span>
                    <a 
                    className='underline text-slate-500 cursor-pointer'
                    onClick={()=>{
                        navigate("/login");
                        setPass("");
                    }}>
                        Login
                    </a>
                </span></p>
            </div>
        </div>
        </div>
    )
}





export default Signin
