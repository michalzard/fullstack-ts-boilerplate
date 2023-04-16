import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import QueryExample from "./components/QueryExample";
const queryClient = new QueryClient({});
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="w-screen h-screen bg-gray-900 flex items-center justify-center">
        <section className='text-blue-50 text-xl font-bold hover:text-blue-400 '>
          React Vite Typescript boilerplate <br />
          <span className="text-gray-400">Enter <code className="text-gray-500">App.tsx</code> to make changes.</span>
        </section>
        <QueryExample />
      </div>
    </QueryClientProvider>
  )
}

export default App
