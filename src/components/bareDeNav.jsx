import { Link, useLocation } from 'react-router-dom';

function Navbar1() {
    // On récupère le chemin actuel (ex: "/gest_client")

    const location = useLocation();
    const path = location.pathname;

    return (
        <div className='fixed z-99 bg-linear-[120deg] shadow-lg text-white from-[#3E3E45] via-[#272729] to-[#1F1F20] h-[calc(100vh-5vh)] w-[18%] m-4 p-4 rounded-2xl'>
            <div className='h-20 flex justify-center items-center border-b border-gray-500'>
                <Link to="/"><h1 className='text-2xl font-bold text-white'><span className='text-blue-500'>Gestion</span> Parking</h1></Link>
            </div>
            <div className='flex justify-center mt-10 w-full'>
                <div className='flex flex-col gap-5 w-full '>
                    
                    {/* Dashboard */}
                    <Link to="/dashboard">
                        <div className={`w-[99%] h-10 flex items-center pl-3 rounded-lg hover:bg-[#626267] ${path === "/dashboard" || path === "/" ? "bg-blue-500 hover:bg-blue-500" : ""}`}>
                            tablo de borde
                        </div>
                    </Link>

                    {/* Clients */}
                    <Link to="/gest_client">
                        <div className={`w-[99%] h-10 flex items-center pl-3 rounded-lg hover:bg-[#626267] ${path === "/gest_client" ? "bg-blue-500 hover:bg-blue-500" : ""}`}>
                            Clients
                        </div>
                    </Link>

                    {/* Voiture */}
                    <Link to="/gest_voiture">
                        <div className={`w-[99%] h-10 flex items-center pl-3 rounded-lg hover:bg-[#626267] ${path === "/gest_voiture" ? "bg-blue-500 hover:bg-blue-500" : ""}`}>
                            voiture
                        </div>
                    </Link>

                </div>
            </div>
        </div>
    );
}

export default Navbar1;