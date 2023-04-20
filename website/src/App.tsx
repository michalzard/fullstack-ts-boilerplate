import PostgresExample from "./components/PostgresExample"
import QueryExample from "./components/QueryExample"
function App() {
  return (
    <div className="w-screen h-screen bg-gray-900 flex flex-col items-center justify-center">
      <section className='text-blue-50 text-xl font-bold hover:text-blue-400 '>
        React Vite Typescript boilerplate <br />
        <span className="text-gray-400 ">Enter <code className="text-gray-500">App.tsx</code> to make changes.</span>
      </section>
      <QueryExample />
      <PostgresExample />
    </div>
  )
}

export default App
