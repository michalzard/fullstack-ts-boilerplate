import PostgresExample from "./components/PostgresExample"
import Header from "./components/Header"
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import RegisterForm from "./components/auth/RegisterForm";
import LoginForm from "./components/auth/LoginForm";
import { useUserStore } from "./store/userStore";
import { useEffect } from "react";
function App() {
  const user = useUserStore();
  useEffect(() => {
    user.checkSession();
  }, []);
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="" element={
          <div className="bg-gray-900 ">
            <Outlet />
            <section className="w-screen h-screen flex flex-col items-center justify-center">
              <section className='text-blue-50 text-xl font-bold hover:text-blue-400 '>
                React Vite Typescript boilerplate <br />
                <span className="text-gray-400 ">Enter <code className="text-gray-500">App.tsx</code> to make changes.</span>
              </section>
              <PostgresExample />
            </section>
          </div>
        }>
          <Route path="register" element={<RegisterForm />} />
          <Route path="login" element={<LoginForm />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
