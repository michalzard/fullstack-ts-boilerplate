import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react'

// basic counter persistance example
function PostgresExample() {
    const { data, error, isLoading, isError } = useQuery({
        queryKey: ["counter"],
        queryFn: () => axios.get(`${import.meta.env.VITE_API_URL}/counter/increment`).then(res => { return res.data }),
    })
    if (isLoading) return <p className='text-white mt-2'>Loading...</p>
    if (isError) return <p className='text-red-400 mt-2'><span className="text-sky-500 font-semibold">Postgresql</span> {error instanceof Error ? error.message : ""}</p>
    return (
        <p className="text-white mt-2">Visit counter : <code className="bg-gray-800 p-1 px-2 rounded-md">{data ? data.counterValue : 0}</code> persisted using <span className="text-sky-500 font-semibold">postgresql</span></p>
    )
}

export default PostgresExample;
