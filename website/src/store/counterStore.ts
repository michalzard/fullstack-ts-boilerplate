import axios from "axios";
import { create } from "zustand";

type CounterState = {
    counter: number;
}
type CounterActions = {
    increment: () => void;
}

export const useCounterStore = create<CounterState & CounterActions>((set, get) => ({
    counter: 0,
    increment: async () => {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/counter/increment`);
        if (res) set({ counter: res.data.counterValue });
    }
}))