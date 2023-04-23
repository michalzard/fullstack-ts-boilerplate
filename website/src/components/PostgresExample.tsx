import axios from 'axios';
import React, { useEffect } from 'react';
import { useCounterStore } from '../store/counterStore';

// basic counter persistance example
function PostgresExample() {
  const state = useCounterStore();
  useEffect(() => {
    state.increment();
  }, []);
  return (
    <p className="text-white mt-2">Visit counter : <code className="bg-gray-800 p-1 px-2 rounded-md">{state.counter}</code> persisted using <span className="text-sky-500 font-semibold">postgresql</span></p>
  )
}

export default PostgresExample;
