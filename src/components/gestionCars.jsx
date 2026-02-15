import { useEffect, useState } from 'react';
import Swal from 'sweetalert2'
import { Link } from 'react-router-dom';
import axios from "axios"; 
import { useSelector, useDispatch } from "react-redux"; 
import { addCars, deletCars, editeCars, fetchCars, fetchClient } from '../redux/slices/clientSlice';

function Gestion_cars() {
    
    const cars = useSelector(state => state.Programe.cars) || [];
    

    const [isOpen, setIsOpen] = useState(false);
    const [editingCar, setEditingCar] = useState(null);
    const [id, setId] = useState("");
    const [marque, setMarque] = useState("");
    const [client_id, setClient_id] = useState("");
    const [img, setImg] = useState("");
    const [search, setSearch] = useState("");
    const [search_C, setSearch_C] = useState("");
    const [listFiltr, setListFilter] = useState(cars);
    const [list_client, setList_client] = useState([]);
    const [list_clientF, setList_clientF] = useState([]);

    useEffect(()=>{
        axios.get('http://localhost:3005/Clients').then((res)=>setList_client(res.data))
    },[])
    useEffect(()=>{
        setList_clientF(list_client.slice(0,5))
    },[list_client])
    
    const link_cars = 'http://localhost:3005/Cars';
    const dispatch = useDispatch();

    const handleSearch = () =>{

        if (!Array.isArray(cars)) return;

        const listF = cars.filter((c) => 
            c.marque && c.marque.toLowerCase().includes(search.toLowerCase())
        );
        
        setListFilter(listF)
        
    }
    useEffect(()=>{
        axios.get(link_cars).then((r) => dispatch(fetchCars(r.data)))
        axios.get('http://localhost:3005/Clients').then((r) => dispatch(fetchClient(r.data)))
        
    }, [dispatch])

    useEffect(() => {
    handleSearch();
}, [search, cars])

    useEffect(() => {
        setListFilter(cars)
    }, [cars]);

    useEffect(()=>{
        setList_clientF(()=>
            list_client.filter((c) => 
            c.nom.toLowerCase().includes(search_C.toLowerCase()) || 
            c.prenom.toLowerCase().includes(search_C.toLowerCase()) || 
            c.tel.includes(search_C))
        );
    }, [search_C]) 

    const handleOpenModal = (client = null) => {
    setEditingCar(client);
    if (client) {
        setMarque(client.marque);
        setClient_id(client.client_id);
        setImg(client.img);
        setId(client.id)
    } else {
        setMarque("");
        setClient_id("");
        setId("");
        setImg("");

    }
    setIsOpen(true);
    };

    const handeledelet = (id) => {
        Swal.fire({
        title: 'Supprimer cet voitur ?',
        text: "Vous ne pourrez pas revenir en arrière !",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Oui, supprimer !',
        cancelButtonText: 'Annuler',
        background: '#fff',
        customClass: {
            popup: 'animated fadeInDown'
        }
        }).then((result) => {
        if (result.isConfirmed) {
            
            axios.delete(`${link_cars}/${id}`).then(()=> dispatch(deletCars(id)))

            Swal.fire(
            'Supprimé !',
            'Le voiture a été supprimé avec succès.',
            'success'
            );
        }
        });

    }

    const handlesave = async () =>{
        if (editingCar === null){
        if (marque !== "" && client_id !== ""  && img !== ""){
            //+id -> old.id + 1 
            const res = await axios.get('http://localhost:3005/ID_cars'); 
            const old_id = res.data.id 
            const new_id = (Number.parseInt(old_id) + 1).toString()
            const new_objId = {id : new_id}
            axios.put(`http://localhost:3005/ID_cars`, new_objId)
            
            //ajouter client
            const new_car = {
            "id": new_id,
            "marque": marque,
            "client_id": client_id,
            "img": img
            }
            
            axios.post(link_cars, new_car).then(r => dispatch(addCars(r.data)))
            setIsOpen(false)
            setMarque("");
            setId("");
            setClient_id("");
            setImg("");
            Swal.fire({
                title: 'Ajoute success',
                text: 'L`ajoute passer',
                icon: 'success',
                confirmButtonText:'good'
            })
        }else{
            Swal.fire({
                title: 'Remplire touts les champes',
                text: 'ne pas remplirer tout les champs',
                icon: 'error',
                confirmButtonText:'oui'
            })
        }
        }else{
        if (marque !== "" && client_id !== ""  && img !== ""){
            Swal.fire({
            title: 'Modifier cet car?',
            text: "Vous ne pourrez pas revenir en arrière !",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#449D44',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Oui, Modiffier !',
            cancelButtonText: 'Annuler',
            background: '#fff',
            customClass: {
                popup: 'animated fadeInDown'
            }
            }).then((result) => {
            if (result.isConfirmed) {
                
                const client_edit = {
                    "id": id,
                    "marque": marque,
                    "client_id": client_id,
                    "img": img
                }
                axios.put(`${link_cars}/${id}`, client_edit).then(r => dispatch(editeCars(r.data)))
                setIsOpen(false)
                setMarque("");
                setId("");
                setClient_id("");
                setImg("");
                Swal.fire(
                'Modiffier !',
                'L’élément a été modiffier avec succès.',
                'success'
                );
                }
            });
            
        }else{
            Swal.fire({
                title: 'Remplire touts les champes',
                text: 'ne pas remplirer tout les champs',
                icon: 'error',
                confirmButtonText:'oui'
            })
        }
        }
    }

    

    const handleAnnuler = () =>{
        setIsOpen(false);
        setEditingCar(null);
        setMarque("");
        setId("");
        setClient_id("");
        setImg("");
    }

    const afficherDetailsClient = (client) => {
        const statutIcon = client.statut === "valid" ? "✅" : "⚠️";
        Swal.fire({
            title: `<strong>Profil Client : ${client.nom} ${client.prenom}</strong>`,
            html: `
                <div style="display: flex; flex-direction: column; align-items: center; gap: 15px;">
                    <img src="/assets/${client.img}" 
                        style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 3px solid #3b82f6; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" 
                        alt="${client.nom}" 
                        onerror="this.src='/assets/default-avatar.png'" />
                    
                    <div style="text-align: left; width: 100%; background: #f9fafb; padding: 15px; border-radius: 10px; border: 1px solid #e5e7eb;">
                    <p style="margin: 8px 0; color: #374151;"><strong>👤 Nom Complet:</strong> ${client.nom} ${client.prenom}</p>
                    <p style="margin: 8px 0; color: #374151;"><strong>📞 Téléphone :</strong> ${client.tel || 'Non renseigné'}</p>
                    <p style="margin: 8px 0; color: #374151;"><strong>statut: 
                        <span style="color: ${client.statut === 'valid' ? '#188236' : '#d33'}">
                            ${statutIcon} ${client.statut}
                        </span>
                    </strong></p>
                    </div>
                </div>
            `,
            showCloseButton: true,
            confirmButtonText: 'Fermer',
            confirmButtonColor: '#3b82f6',
            customClass: {
            popup: 'rounded-xl shadow-2xl'
            }
        });
};

    return (
        <>
        {isOpen && (
            
            <div className="fixed inset-0 z-1000 flex items-center justify-center bg-black/50 backdrop-blur-sm ">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-[45%] p-6 relative animate-in fade-in zoom-in duration-200">
                <h2 className="text-xl font-bold mb-4 text-[#344767]">
                {editingCar ? 'Modifier Voiture' : 'Ajouter un Voiture'}
                </h2>
                
                <form className="flex flex-col gap-4 ">
                <div className='flex justify-around'>
                    <input 
                    type="text" 
                    placeholder="la marque" 
                    value={marque}
                    onChange={(e) => setMarque(e.target.value)}
                    className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                </div>
                <div>
                    <input type="text" placeholder='Rechercher client' className='w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' onChange={(e)=>setSearch_C(e.target.value)}/>
                    <div className="h-32 overflow-y-auto shadow-lg rounded-lg">
                        {list_clientF.map((c, i)=>
                            <div key={i} onClick={()=>setClient_id(c.id)} className={client_id === c.id ? 'bg-green-300 hover:bg-green-300' : ' hover:bg-gray-100'}>
                                <div key={c.id} className="border-b border-[#AAADBE] ">
                                    <div className="px-6 py-4 font-medium flex items-center gap-3">
                                        <img className='rounded-full w-10 h-10' src={`/assets/${c.img}`} alt="" /> 
                                        <p>{c.nom} {c.prenom}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    {console.log(client_id)}
                </div>
                <input 
                    type="file"  
                    onChange={(e) => setImg(e.target.files[0].name)}
                    className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
                {img != "" && 
                <div className='w-[25%] rounded-lg'>
                    <img className='rounded-lg' src={typeof img === 'string' ? `/assets/${img}` : URL.createObjectURL(img)} alt="" />
                </div>}
                <div className="flex justify-end gap-2 mt-4">
                    <button 
                    type="button"
                    onClick={handleAnnuler}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
                    >
                    Annuler
                    </button>
                    <button 
                    type="button"
                    onClick={() => handlesave()}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer"
                    >
                    Enregistrer
                    </button>
                </div>
                </form>
            </div>
            </div>
        )}
        <div className='w-[80%] absolute top-0 right-0 mt-4 mr-2 '>
            {/* Barre de recherche (inchangée) */}
            <div className='fixed bg-white w-[80%] flex justify-between items-center shadow-lg opacity-95 rounded-lg z-99'>
            {/* ... ton code de header ... */}
            <div className='p-3 flex flex-col gap-3'>
                <div className='flex items-center gap-2'>
                <Link to='/dashboard'>
                    <svg style={{color: '#344767'}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                    <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
                    <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
                    </svg>
                </Link>
                <p className='text-[#344767]'> / cars</p>
                </div>
                <div><p className='text-[#344767] font-bold text-lg'>gestion cars</p></div>
            </div>
            <div className='flex items-center gap-2 pr-3'>
                <input type="text" placeholder='search' className='border rounded-lg h-12 pl-2 border-gray-500' onChange={(e)=>setSearch(e.target.value)}/>
            </div>
            </div>

            <div className='w-full mt-40'>
            <div className='relative w-90% mx-3'>
                <div className='absolute -top-8 left-1.5 rounded-lg bg-blue-500 w-[99%] z-10 h-15 flex items-center shadow-lg'>
                <h1 className='text-white ml-4 font-bold text-xl'>cars table</h1>
                </div>
                
                <div className='w-full bg-white border border-gray-200 pt-9 rounded-lg shadow-2xl'>
                <div className='my-4 ml-2'>
                    {/* btn ajote */}
                    <button 
                    onClick={() => handleOpenModal()} 
                    className='px-2 py-1 bg-blue-500 text-white font-bold rounded-br-lg rounded-tl-lg transition-colors delay-75 duration-300 hover:bg-linear-to-r  hover:from-blue-500 hover:to-purple-700 hover:shadow-lg hover:cursor-pointer '
                    >
                    +Ajouter
                    </button>
                </div>

                <div className="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base ">
                    <table className="w-full text-sm text-left text-body">
                    <thead className="text-sm text-[#AAADBE] border-b border-[#AAADBE]">
                        <tr>
                        <th className="px-6 py-3 font-medium">Cars</th>
                        <th className="px-6 py-3 font-medium">Marque</th>
                        <th className="px-6 py-3 font-medium">Client</th>
                        <th className="px-6 py-3 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listFiltr && listFiltr.length > 0 ? (
                        listFiltr.map((c) => {
                            const Client = list_client.find((cl) => String(cl.id) === String(c.client_id));
                            return(
                                <tr key={c.id} className="border-b border-[#AAADBE] hover:bg-gray-100">
                                    <th className="px-6 py-4 font-medium flex items-center gap-3">
                                        <img className='rounded-full w-10 h-10' src={`/assets/${c.img}`} alt="" /> 
                                    </th>
                                    <td className="px-6 py-4">
                                        <p>{c.marque}</p>
                                    </td>
                                    <td className="px-6 py-4 " >
                                        <div className='flex items-center gap-2 hover:cursor-pointer w-auto' onClick={()=>afficherDetailsClient(Client)}>
                                            <img className='rounded-full w-10 h-10' src={`/assets/${Client ? Client.img : ""}`} alt="" />
                                            <p className=' font-bold '>{Client ? `${Client.nom} ${Client.prenom}` : ""} </p>
                                        </div>
                                        
                                    </td>
                                    <td className="px-6 py-4 ">
                                        <button onClick={() => handleOpenModal(c)} className="text-blue-600 hover:underline hover:cursor-pointer">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                            </svg>
                                        </button>
                                        <button onClick={() => handeledelet(c.id)} className="text-red-600 hover:underline ml-1.5 hover:cursor-pointer">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            )
                        })
                        ) : (
                        <tr><td colSpan="5" className="text-center py-4">Aucun client trouvé</td></tr>
                        )}
                    </tbody>
                    </table>
                </div>
                </div>
            </div>
            </div>
        </div>
        </>
    );
}

export default Gestion_cars;