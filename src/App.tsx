import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Nav from './components/Nav';
import Index from './pages/Index';
import Coban from './pages/Coban';
import KieuDuLieu from './pages/KieuDuLieu';
import OOP from './pages/OOP';
import Generics from './pages/Generics';
import NangCao from './pages/NangCao';
import ThucChien from './pages/ThucChien';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <Nav />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/01-co-ban" element={<Coban />} />
        <Route path="/02-kieu-du-lieu" element={<KieuDuLieu />} />
        <Route path="/03-oop" element={<OOP />} />
        <Route path="/04-generics" element={<Generics />} />
        <Route path="/05-nang-cao" element={<NangCao />} />
        <Route path="/06-thuc-chien" element={<ThucChien />} />
      </Routes>
    </>
  );
}
