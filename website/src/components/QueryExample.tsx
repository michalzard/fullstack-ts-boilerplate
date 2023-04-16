import React from 'react'
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

function QueryExample() {
    const { isLoading, status, error, data } = useQuery({
        queryKey: ["example"],
        queryFn: () => axios.get(`https://localhost:5000`).then(res => { console.log("Query requested", res.data); return res.data })
    });
    if (isLoading) return <div className='bg-red-300'>Loading...</div>
    if (status === "error") return <div className='bg-red-300'>An Error occured : {error instanceof Error ? error.message : ""}</div>
    return (
        <div className='bg-red-300'>Data loaded via Tanstack React Query {JSON.stringify(data)}</div>
    )
}

export default QueryExample