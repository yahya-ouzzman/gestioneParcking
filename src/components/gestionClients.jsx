import { useEffect, useState } from 'react';
import Swal from 'sweetalert2'
import { Link } from 'react-router-dom';
import axios from "axios"; 
import { useSelector, useDispatch } from "react-redux"; 
import { fetchCars,addClient, deletCars, deletClient, editeClient, fetchClient } from '../redux/slices/clientSlice';


function Gestion_client() {
    const clients = useSelector(state => state.Programe.clients) || [];
    const cars = useSelector(state => state.Programe.cars) || [];
    console.log(clients)
            
    const [isOpen, setIsOpen] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [id, setId] = useState("");
    const [nom, setNom] = useState("");
    const [prenom, setprenom] = useState("");
    const [date, setDate] = useState("");
    const [tel, setTel] = useState("");
    const [img, setImg] = useState("");
    const [statut, setStatut] = useState("");
    const [search, setSearch] = useState("");
    const [listFiltr, setListFilter] = useState(clients);

    const link_client = 'http://localhost:3005/Clients';
    const dispatch = useDispatch();

    const handleSearch = () =>{

        const listF = clients.filter((c) => 
            c.nom.toLowerCase().includes(search.toLowerCase()) || 
            c.prenom.toLowerCase().includes(search.toLowerCase()) || 
            c.tel.includes(search) || 
            c.date.includes(search)
        );
        
        setListFilter(listF)
        
    }
    useEffect(()=>{
        axios.get(link_client).then((r) => dispatch(fetchClient(r.data)))
        axios.get('http://localhost:3005/Cars').then((r) => dispatch(fetchCars(r.data)))
    }, [dispatch])

    useEffect(() => {
    handleSearch();
}, [search, clients])

    useEffect(() => {
        setListFilter(clients)
    }, [clients]);

    const handleOpenModal = (client = null) => {
    setEditingClient(client);
    if (client) {
        setNom(client.nom);
        setprenom(client.prenom);
        setDate(client.date);
        setTel(client.tel);
        setImg(client.img);
        setStatut(client.statut);
        setId(client.id)
    } else {
        setNom("");
        setprenom("");
        setDate("");
        setTel("");
        setImg("");

    }
    setIsOpen(true);
    };

    const handeledelet = (id) => {
        Swal.fire({
        title: 'Supprimer cet élément ?',
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
        if (result.isConfirmed)  {
            
            axios.delete(`${link_client}/${id}`)
                .then(() => {
                    dispatch(deletClient(id)); // حذف العميل من Redux

                    // 2. البحث عن سيارات هذا العميل في المصفوفة الحالية
                    // تأكد أن cars قادمة من useSelector(state => state.Programe.cars)
                    console.log(cars)
                    console.log('ya')
                    const voituresDuClient = cars.filter((c) => String(c.client_id) === String(id));

                    // 3. حذف كل سيارة على حدة
                    voituresDuClient.forEach((car) => {
                        axios.delete(`http://localhost:3005/Cars/${car.id}`)
                            .then(() => {
                                dispatch(deletCars(car.id)); // حذف السيارة من Redux فور نجاح حذفها من السيرفر
                            })
                            .catch(err => console.log("Erreur suppression voiture:", err));
                    });

                    Swal.fire(
                        'Supprimé !',
                        'Le client et ses voitures ont été supprimés avec succès.',
                        'success'
                    );
                })
                .catch(err => console.log("Erreur suppression client:", err));
        }
        });

    }

    const handlesave = async () =>{
        if (editingClient === null){
        if (nom !== "" && prenom !== "" && tel !== "" && date !== "" && img !== ""){
            //+id -> old.id + 1 
            const res = await axios.get('http://localhost:3005/ID_client'); 
            const old_id = res.data.id 
            const new_id = (Number.parseInt(old_id) + 1).toString()
            const new_objId = {id : new_id}
            axios.put(`http://localhost:3005/ID_client`, new_objId)
            
            //ajouter client
            const new_client = {
            "id": new_id,
            "nom": nom,
            "prenom": prenom,
            "date": date,
            "statut": "valid",
            "tel": tel,
            "img": img
            }
            
            axios.post(link_client, new_client).then(r => dispatch(addClient(r.data)))
            setIsOpen(false)
            setNom("");
            setprenom("");
            setDate("");
            setTel("");
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
        if (nom !== "" && id !== "" && prenom !== "" && tel !== "" && date !== "" && img !== ""){
            Swal.fire({
            title: 'Modifier cet client ?',
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
                    "nom": nom,
                    "prenom": prenom,
                    "date": date,
                    "statut": statut,
                    "tel": tel,
                    "img": img
                    }
                    axios.put(`${link_client}/${id}`, client_edit).then(r => dispatch(editeClient(r.data)))
                    setIsOpen(false)
                    setNom("");
                    setprenom("");
                    setDate("");
                    setTel("");
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
        setEditingClient(null);
        setNom("");
        setprenom("");
        setDate("");
        setTel("");
        setImg("");
        setId("")
    }

   

    return (
        <>
        {isOpen && (
            <div className="fixed inset-0 z-1000 flex items-center justify-center bg-black/50 backdrop-blur-sm ">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-[45%] p-6 relative animate-in fade-in zoom-in duration-200">
                <h2 className="text-xl font-bold mb-4 text-[#344767]">
                {editingClient ? 'Modifier Client' : 'Ajouter un Client'}
                </h2>
                
                <form className="flex flex-col gap-4 ">
                <div className='flex justify-around'>
                    <input 
                    type="text" 
                    placeholder="Nom du client" 
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                    <input 
                    type="text" 
                    placeholder="Prenom du client" 
                    value={prenom}
                    onChange={(e) => setprenom(e.target.value)}
                    className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                </div>
                <input 
                    type='number' 
                    placeholder="Téléphone" 
                    value={tel}
                    onChange={(e) => setTel(e.target.value)}
                    className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
                <input 
                    type="date"  
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
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
                <p className='text-[#344767]'> / Clients</p>
                </div>
                <div><p className='text-[#344767] font-bold text-lg'>gestion clients</p></div>
            </div>
            <div className='flex items-center gap-2 pr-3'>
                <input type="text" placeholder='search' className='border rounded-lg h-12 pl-2 border-gray-500' onChange={(e)=>setSearch(e.target.value)}/>
            </div>
            </div>

            <div className='w-full mt-40'>
            <div className='relative w-90% mx-3'>
                <div className='absolute -top-8 left-1.5 rounded-lg bg-blue-500 w-[99%] z-10 h-15 flex items-center shadow-lg'>
                <h1 className='text-white ml-4 font-bold text-xl'>Clients table</h1>
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
                        <th className="px-6 py-3 font-medium">Clients</th>
                        <th className="px-6 py-3 font-medium">Date</th>
                        <th className="px-6 py-3 font-medium">Statut</th>
                        <th className="px-6 py-3 font-medium">Telephone</th>
                        <th className="px-6 py-3 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listFiltr && listFiltr.length > 0 ? (
                        listFiltr.map((c) => (
                            <tr key={c.id} className="border-b border-[#AAADBE] hover:bg-gray-100">
                            <th className="px-6 py-4 font-medium flex items-center gap-3">
                                <img className='rounded-full w-10 h-10' src={`/assets/${c.img}`} alt="" /> 
                                <p>{c.nom} {c.prenom}</p>
                            </th>
                            <td className="px-6 py-4">{c.date}</td>
                            <td className="px-6 py-4">
                                <span className='px-2 py-1 rounded-lg border border-green-700 bg-green-300 text-green-700'>{c.statut}</span>
                            </td>
                            <td className="px-6 py-4">{c.tel}</td>
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
                            
                        ))
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

export default Gestion_client;