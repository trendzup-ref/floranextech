import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context';
import Layout from './components/Layout.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Services from './pages/Services.jsx';
import Products from './pages/Products.jsx';
import EbookDetails from './pages/EbookDetails.jsx';
import Contact from './pages/Contact.jsx';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import PublishEbook from './pages/PublishEbook.jsx';
import AccessDenied from './pages/AccessDenied.jsx';
import MyPurchases from './pages/MyPurchases.jsx';
import ProtectedAdminRoute from './components/ProtectedAdminRoute.jsx';

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
            <Route path="products/:slug" element={<EbookDetails />} />
            <Route path="my-purchases" element={<MyPurchases />} />
            <Route path="access-denied" element={<AccessDenied />} />
            <Route path="contact" element={<Contact />} />

            {/* Protected Admin Only Routes */}
            <Route
              path="admin/dashboard"
              element={
                <ProtectedAdminRoute>
                  <AdminDashboard />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="admin/ebooks/publish"
              element={
                <ProtectedAdminRoute>
                  <PublishEbook />
                </ProtectedAdminRoute>
              }
            />
          </Route>

          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
