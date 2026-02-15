import './App.css'
import Gestion_client from './components/gestionClients';
import Navbar1 from './components/bareDeNav'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Gestion_cars from './components/gestionCars';


function App() {

  return (
    <Router> 
      <div className='relative flex bg-[#F0F2F5] min-h-screen'>
        <Navbar1 /> 
        <Routes>
          <Route path='/gest_client' element={<Gestion_client />}/>
          <Route path='/dashboard' element={<div className="p-10"></div>}/>
          <Route path='/gest_voiture' element={<Gestion_cars />}/>
          <Route path='/' element=""/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;