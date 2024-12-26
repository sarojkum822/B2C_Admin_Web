import React, { useState } from 'react';
import {auth} from '../Firebase/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth';
import {  useNavigate } from 'react-router-dom';


const Login = () => {
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [message,setMessage] = useState("")
     
    const navigate = useNavigate()

    const handleSignin =async()=>{
        console.log(email+password);
        navigate('/dashboard')
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                navigate('/dashboard')
            })
            .catch((error) => {
                const errorCode = error.code;
                console.log(errorCode);
            });
    }
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
            <div className="w-4/5 max-w-md bg-[#FCD191] p-10 rounded-2xl shadow-lg flex flex-col items-center">
                <img src="/src/assets/logoimg.svg" alt="Your Icon" className="w-1/2 mb-8" />
                
                <p className="text-xl font-semibold text-gray-600 mb-8 font-nunito">B2C Website Admin Login</p>

                <form className="w-full" onSubmit={handleSignin}>
                    <p className="text-lg font-medium text-black mb-2">Email:</p>
                    <input type="text" value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full p-3 mb-5 text-base border-2 border-gray-400 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F28500]" />
                    
                    <p className="text-lg font-medium text-black mb-2">Password:</p>
                    <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full p-3 mb-5 text-base border-2 border-gray-400 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F28500]" />
                    
                    <button type="submit"  className="w-full p-4 bg-[#F28500] text-white font-semibold rounded-lg hover:bg-[#e67e00] transition duration-300">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
