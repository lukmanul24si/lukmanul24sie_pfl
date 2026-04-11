import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';

// Perhatikan huruf "T" besar menyesuaikan nama folder lu
import BiodataDiri from './Tugas2/BiodataDiri'; 
import PendaftaranEsports from './Tugas3/PendaftaranEsports'; 
import WisataDashboard from './Tugas4/WisataDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rute Halaman Utama (Dashboard) */}
        <Route path="/" element={<Home />} />
        
        {/* Rute Modul 2 */}
        <Route path="/tugas2" element={<BiodataDiri />} />
        
        {/* Rute Modul 3 */}
        <Route path="/tugas3" element={<PendaftaranEsports />} />

        {/* Rute Modul 3 */}
        <Route path="/tugas4" element={<WisataDashboard />} />
        
      </Routes>
    </BrowserRouter>
  );
}