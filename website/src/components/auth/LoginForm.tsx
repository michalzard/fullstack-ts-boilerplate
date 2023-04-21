import { useFormik } from 'formik';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { queryClient } from '../../main';
import axios from 'axios';

function LoginForm() {
    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem("token");
    const { values, handleBlur, handleChange, handleSubmit, isSubmitting } = useFormik({
        initialValues: {
            username: "",
            password: "",
        },
        onSubmit: (values, form) => {
            axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, { ...values }).then(res => {
                console.log(res.data);
                const token = res.headers?.authorization;
                const { user } = res.data;
                if (token) {
                    const tokenValue = token.split("Bearer ")[1];
                    localStorage.setItem("token", tokenValue);
                    queryClient.setQueryData(["user"], user);
                    navigate("/");
                    form.resetForm();
                }
            }).catch(err => {
                console.error(err.response);
            })
        },
    })
    if (isLoggedIn) navigate("/");
    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 items-center justify-center p-4 text-white">
            <input id="username" type="text" placeholder="Username" value={values.username} onChange={handleChange} onBlur={handleBlur} className='bg-gray-700 rounded-md p-2' />
            <input id="password" type="password" placeholder="Password" value={values.password} onChange={handleChange} onBlur={handleBlur} className='bg-gray-700 rounded-md  p-2' />
            <button type="submit" disabled={isSubmitting} onChange={handleChange} onBlur={handleBlur} className='text-white bg-sky-700 rounded-md  p-2 px-6'>Login</button>
        </form>
    )
}

export default LoginForm