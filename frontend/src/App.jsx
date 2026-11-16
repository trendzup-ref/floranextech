import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context';
import Layout from './components/Layout.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Services from './pages/Services.jsx';
import Products from './pages/Products.jsx';
import Contact from './pages/Contact.jsx';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import PublishEbook from './pages/PublishEbook.jsx';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="services" element={<Services />} />
            <Route path="products" element={<Products />} />
            <Route path="contact" element={<Contact />} />
            <Route path="admin/dashboard" element={<AdminDashboard />} />
            <Route path="admin/ebooks/publish" element={<PublishEbook />} />
          </Route>

          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
