import React from 'react'
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

function QueryExample() {
    const { isLoading, status, error, data } = useQuery({
        queryKey: ["example"],
        queryFn: () => axios.get(`${import.meta.env.VITE_API_URL}`).then(res => { return res.data }),
    });
    useQuery({
        queryKey: ["session"],
        queryFn: () => axios.get(`${import.meta.env.VITE_API_URL}/auth/session`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")} `
            }
        }).then(res => { return res.data }),
        staleTime: Infinity,
        refetchOnWindowFocus: false,
    });
    if (isLoading) return <div className='bg-green-800'>Loading...</div>
    if (status === "error") return <div className='bg-red-800'>An Error occured : {error instanceof Error ? error.message : ""}</div>
    return (
        <>
            <span className='text-red-400 text-base text-center mb-1'>Query Client's defaults are overriden to have infinity stale time so that it fetches only once unless you specify otherwise.</span>
            <span className='text-red-400 text-base text-center mb-1'>Retry is set <code className='bg-gray-800 p-1 px-2 rounded-md'>false</code> so that you dont try refetching multiple times unless you specify otherwise.</span>
            <span className='text-green-400 font-semibold text-sm text-center'>Data loaded via Tanstack React Query {JSON.stringify(data)} </span>
        </>
    )
}

export default QueryExample