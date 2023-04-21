import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import React from 'react'
import { useNavigate } from "react-router-dom";
import { queryClient } from '../main';

function Header() {
    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem("token");
    const logoutQuery = useQuery({
        queryKey: ["logout"],
        queryFn: () => axios.post(`${import.meta.env.VITE_API_URL}/auth/logout`, {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }).then(res => {
            localStorage.removeItem("token");
            navigate("/");
        }).catch(err => { console.error(err) }),
        enabled: false,
        refetchOnWindowFocus: false,
    })
    return (
        <header className="bg-gray-700 w-full h-10 flex items-center justify-between p-6">
            <button onClick={() => navigate("/")} className='font-semibold text-orange-400 p-1 px-2'>Testing data</button>
            <nav>
                {
                    isLoggedIn ?
                        <>
                            <button onClick={() => logoutQuery.refetch()} className="bg-red-500 text-white p-1 px-3 rounded-md mr-3">Logout</button>
                        </>
                        :
                        <>
                            <button onClick={() => navigate("/login")} className="bg-red-500 text-white p-1 px-3 rounded-md mr-3">Login</button>
                            <button onClick={() => navigate("/register")} className="bg-red-500 text-white p-1 px-3 rounded-md">Register</button>
                        </>
                }

            </nav>
        </header>
    )
}

export default Header