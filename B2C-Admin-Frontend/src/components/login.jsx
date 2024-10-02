import React from 'react';

const Login = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
            <div className="w-4/5 max-w-md bg-[#FCD191] p-10 rounded-2xl shadow-lg flex flex-col items-center">
                <img src="/src/assets/logoimg.svg" alt="Your Icon" className="w-1/2 mb-8" />
                
                <p className="text-xl font-semibold text-gray-600 mb-8 font-nunito">B2C Website Admin Login</p>

                <form className="w-full">
                    <p className="text-lg font-medium text-black mb-2">Email:</p>
                    <input type="text" className="w-full p-3 mb-5 text-base border-2 border-gray-400 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F28500]" />
                    
                    <p className="text-lg font-medium text-black mb-2">Password:</p>
                    <input type="password" className="w-full p-3 mb-5 text-base border-2 border-gray-400 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F28500]" />
                    
                    <button type="submit" className="w-full p-4 bg-[#F28500] text-white font-semibold rounded-lg hover:bg-[#e67e00] transition duration-300">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
