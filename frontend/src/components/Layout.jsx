import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children }) {
  const location = useLocation();
  const isFullBleed =
    location.pathname === '/' ||
    location.pathname === '/services' ||
    location.pathname === '/contact' ||
    location.pathname === '/about' ||
    location.pathname === '/products';

  return (
    <div className="min-h-screen flex flex-col bg-primary text-gray-100 font-body antialiased selection:bg-secondary selection:text-primary">
      <Navbar />
      <main className={`flex-1 w-full ${isFullBleed ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'}`}>
        {children || <Outlet />}
      </main>
      <Footer />
    </div>
  );
}
