import './App.css'
import Gestion_client from './components/gestionClients';
import Navbar1 from './components/bareDeNav'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Gestion_cars from './components/gestionCars';
import Dachboord from './components/dachboord';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { editeStatut } from './redux/slices/clientSlice';


function App() {
    const clients = useSelector(state => state.Programe.clients) || [];

    const link_client = 'http://localhost:3005/Clients';
    const dispatch = useDispatch();

    const date = new Date().toISOString().split('T')[0];
    const date_new = new Date(date)
    
    useEffect(()=>{
      clients.map((c)=>{
          const date1 = new Date(c.date);
          console.log(date1)
          const diffInMs = Math.abs(date_new - date1);
          const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
          console.log(diffInDays)
          if (diffInDays >= 31){
              const new_client_statut = {
                  "id": c.id,
                  "nom": c.nom,
                  "prenom": c.prenom,
                  "date": c.date,
                  "statut": 'InValid',
                  "tel": c.tel,
                  "img": c.img
              }
              axios.put(`${link_client}/${c.id}`, new_client_statut).then(()=>dispatch(editeStatut({'id':c.id, 'statut': 'InValid'})))   
          }else{
            if (c.statut === "InValid"){
              const new_client_statut = {
                  "id": c.id,
                  "nom": c.nom,
                  "prenom": c.prenom,
                  "date": c.date,
                  "statut": 'Valid',
                  "tel": c.tel,
                  "img": c.img
              }
              axios.put(`${link_client}/${c.id}`, new_client_statut).then(()=>dispatch(editeStatut({'id':c.id, 'statut': 'Valid'}))) 
            }
          }
      })
    }, [clients, date_new, dispatch])
  return (
    <Router> 
      <div className='relative flex bg-[#F0F2F5] min-h-screen'>
        <Navbar1 /> 
        <Routes>
          <Route path='/gest_client' element={<Gestion_client />}/>
          <Route path='/dashboard' element={<Dachboord />}/>
          <Route path='/gest_voiture' element={<Gestion_cars />}/>
          <Route path='/' element={<Dachboord />}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;