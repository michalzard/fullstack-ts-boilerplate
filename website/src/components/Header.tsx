import { useNavigate } from "react-router-dom";
import { useUserStore } from '../store/userStore';

function Header() {
    const navigate = useNavigate();
    const user = useUserStore();

    return (
        <header className="bg-gray-700 w-full h-10 flex items-center justify-between p-6">
            <button onClick={() => navigate("/")} className='font-semibold text-orange-400 p-1 px-2'>Testing data</button>
            <nav>
                {
                    user.isLoggedIn ?
                        <>
                            <button onClick={() => user.logout(navigate)} className="bg-red-500 text-white p-1 px-3 rounded-md mr-3">Logout</button>
                        </>
                        :
                        <>
                            <button onClick={() => navigate("/login")} className="bg-red-500 text-white p-1 px-3 rounded-md mr-3">Login</button>
                            <button onClick={() => navigate("/register")} className="bg-red-500 text-white p-1 px-3 rounded-md">Register</button>
                        </>
                }

            </nav>
        </header >
    )
}

export default Header