
import { useState } from 'react'
import { Navigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState('');
    const [psw, setPsw] = useState('');
    
    const handeleSubmit = (e) =>{
        if (email === 'yahyaouzzman6@gmail.com' && psw === 'admin123') {
        e.preventDefault();
        Navigate('/home');
        }else{
        e.preventDefault();
        alert('email ou mote de passe ne pas corécte')
        }
    }

    return (
        <div className="w-full h-screen bg-[url(./assets/bg_login3.jpg)] flex justify-center items-center flex-col gap-6">
        <h1 className='text-8xl mt-4 font-bold text-blue-500 animate-bounce'>Gestion<span className='text-white'>Parking</span> </h1>
        <div className='w-[40%] h-[50%] border-4 border-blue-500  flex flex-col justify-center items-center bg-gray-100 opacity-75 hover:opacity-100 gap-2 rounded-lg transition delay-150 duration-300 ease-in-out'>
            <h1 className='text-5xl mt-4 font-bold text-blue-500'>Login</h1>
            <form className='w-[80%]' onSubmit={(e)=>handeleSubmit(e)}>
            <div className='flex flex-col gap-1 p-3'>
                <label className="text-gray-700  font-semibold">Email :</label>
                <input className='h-8 p-1 border-2 border-gray-500 rounded-lg dark:border-amber-50' type="email" required placeholder="exemple@gmail.com" onChange={(e)=>setEmail(e.target.value)} />
            </div>
            <div className='flex flex-col gap-1 p-3'>
                <label className="text-gray-700 font-semibold">Mote de pass :</label>
                <input className='h-8 p-1 border-2 border-gray-500 rounded-lg' type='password' required placeholder="mote de pass" onChange={(e)=>setPsw(e.target.value)}/>
            </div>
            <div className='flex flex-col gap-1 p-3 items-center'>
                <input type="submit" className='cursor-pointer w-[30%] px-2 py-1 rounded-lg bg-blue-500 text-amber-50 font-bold transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500' value="se connecter"/>
            </div>
            <div className='flex flex-col gap-1 p-3 items-center'>
                <p><a href="#" >Créer un compte ?</a></p>
            </div>
            </form>
            
        </div>
        
        </div>

    )
}

export default Login
