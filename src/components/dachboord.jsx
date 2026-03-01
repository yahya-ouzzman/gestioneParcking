import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios"; 
import { useSelector, useDispatch } from "react-redux"; 
import { fetchCars, fetchClient} from '../redux/slices/clientSlice';
import { FaUser, FaCar, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';



function Dachboord() {
    const dispatch = useDispatch();
    const clients = useSelector(state => state.Programe.clients) || [];
    const cars = useSelector(state => state.Programe.cars) || [];

    const [clients_valid, setClients_valid] = useState(clients.filter((c)=>c.statut.toLocaleLowerCase() === 'valid'))
    const [clients_invalid, setClients_invalid] = useState(clients.filter((c)=>c.statut.toLocaleLowerCase() === 'invalid'))
    
    

useEffect(() => {
    setClients_valid(clients.filter((c)=>c.statut.toLocaleLowerCase() === 'valid'))
    setClients_invalid(clients.filter((c)=>c.statut.toLocaleLowerCase() === 'invalid'))
}, [clients]);

useEffect(() => {
    
    axios.get('http://localhost:3005/Clients').then((res)=>dispatch(fetchClient(res.data)));

}, [dispatch]);

useEffect(() => {

    axios.get('http://localhost:3005/Cars').then((res)=>dispatch(fetchCars(res.data)));

}, [dispatch]);


const dynamicData = [
    { name: 'Valides', count: clients_valid.length, color: '#54AD58' },
    { name: 'Invalides', count: clients_invalid.length, color: '#E43270' }
];


    return (

        <div className='w-[80%] absolute top-0 right-0 mt-4 mr-2 '>
            
            <div className='fixed bg-white w-[80%] flex justify-between items-center shadow-lg opacity-95 rounded-lg z-99'>
            <div className='p-3 flex flex-col gap-3'>
                <div className='flex items-center gap-2'>
                <Link to='/dashboard'>
                    <svg style={{color: '#344767'}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                    <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
                    <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
                    </svg>
                </Link>
                <p className='text-[#344767]'> / dashbord</p>
                </div>
                <div><p className='text-[#344767] font-bold text-lg'>gestion clients</p></div>
            </div>
            <div className='flex items-center gap-2 pr-3'>
                <input type="text" placeholder='search' className='border rounded-lg h-12 pl-2 border-gray-500' onChange={(e)=>setSearch(e.target.value)}/>
            </div>
            </div>

            <div className='w-full mt-40'>
                <div className='w-full flex justify-between gap-2 p-3'>
                    <div className='w-[25%] h-30 bg-white shadow-xl rounded-lg flex justify-between items-center px-3 relative'>
                        <div className='h-[50%] w-[25%] bg-[#38383E] rounded-lg text-xl text-white flex justify-center items-center absolute -top-7 shadow-lg'>
                            <FaUser />
                        </div> 
                        <div className='absolute right-4'>
                            <p className='text-[#A1909A]'>Clients</p>
                            <span className=' font-bold text-2xl text-end'><p>+{clients.length}</p></span>
                        </div>
                    </div>
                    <div className='w-[25%] h-30 bg-white shadow-xl rounded-lg flex justify-between items-center px-3 relative'>
                        <div className='h-[50%] w-[25%] bg-[#358FEE] rounded-lg text-xl text-white flex justify-center items-center absolute -top-7 shadow-lg'>
                            <FaCar />
                        </div> 
                        <div className='absolute right-4'>
                            <p className='text-[#A1909A]'>Voiturs</p>
                            <span className=' font-bold text-2xl text-end'><p>+{cars.length}</p></span>
                        </div>
                    </div>
                    <div className='w-[25%] h-30 bg-white shadow-xl rounded-lg flex justify-between items-center px-3 relative'>
                        <div className='h-[50%] w-[25%] bg-[#54AD58] rounded-lg text-xl text-white flex justify-center items-center absolute -top-7 shadow-lg'>
                            <FaCheckCircle color="white" />
                        </div> 
                        <div className='absolute right-4'>
                            <p className='text-[#A1909A]'>Les Clients Valid</p>
                            <span className=' font-bold text-2xl text-end'><p>+{clients_valid.length}</p></span>
                        </div>
                    </div>
                    <div className='w-[25%] h-30 bg-white shadow-xl rounded-lg flex justify-between items-center px-3 relative'>
                        <div className='h-[50%] w-[25%] bg-[#E43270] rounded-lg text-xl text-white flex justify-center items-center absolute -top-7 shadow-lg'>
                            <FaTimesCircle color="white" />
                        </div> 
                        <div className='absolute right-4'>
                            <p className='text-[#A1909A]'>Les Clients InValide</p>
                            <span className=' font-bold text-2xl text-end'><p>+{clients_invalid.length}</p></span>
                        </div>
                    </div>
                </div>
                <div className='flex gap-2 p-3 h-[350px]'>
                    <div className='flex-1 bg-white rounded-lg p-1 shadow-inner'>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dynamicData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip cursor={{fill: 'transparent'}} />
                                <Bar dataKey="count" radius={[5, 5, 0, 0]}>
                                    {dynamicData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default Dachboord;