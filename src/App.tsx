import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Nav from './components/Nav';
import Index from './pages/Index';
import Coban from './pages/Coban';
import KieuDuLieu from './pages/KieuDuLieu';
import OOP from './pages/OOP';

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
      </Routes>
    </>
  );
}
