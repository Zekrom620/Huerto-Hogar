import React from 'react';
// AÑADIMOS 'Outlet' a los imports de react-router-dom
import { BrowserRouter as Router, Routes, Route, useLocation, Outlet } from 'react-router-dom'; 

// Componentes de Layout (Common)
import Header from './components/common/Header'; 
import Footer from './components/common/Footer'; 
import AdminLayout from './layouts/AdminLayout'; 
// AÑADIMOS EL PROTECTED ROUTE
import ProtectedRoute from './components/common/ProtectedRoute'; 

// Componentes de Páginas Públicas y Autenticación (Migradas)
import Home from './pages/Home'; 
import Products from './pages/Products'; 
import ProductDetail from './pages/ProductDetail'; 
import ShoppingCart from './pages/ShoppingCart'; 
import Register from './pages/Register';
import Login from './pages/Login';
import Contacto from './pages/Contacto'; 
import Nosotros from './pages/Nosotros'; 
import Blogs from './pages/Blogs'; 
import BlogDetail from './pages/BlogDetail'; 

// Componentes de Administración (TODOS COMPLETOS)
import AdminHome from './pages/admin/AdminHome'; 
import AdminProducts from './pages/admin/AdminProducts'; 
import AdminProductNew from './pages/admin/AdminProductNew'; 
import AdminProductEdit from './pages/admin/AdminProductEdit'; 
import AdminUsers from './pages/admin/AdminUsers'; 
import AdminUserNew from './pages/admin/AdminUserNew'; 
import AdminUserEdit from './pages/admin/AdminUserEdit'; 

// Componente Wrapper para Header/Footer
const NotFound = () => <h1>404 - Página No Encontrada</h1>;

const LayoutWrapper = ({ children }) => {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin');

    if (isAdminRoute) {
        return children;
    }

    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    );
};

function App() {
  return (
    <Router>
        <LayoutWrapper> 
            <Routes>
                {/* -------------------- RUTAS PÚBLICAS Y DE AUTENTICACIÓN -------------------- */}
                <Route path="/" element={<Home />} />
                <Route path="/productos" element={<Products />} /> 
                <Route path="/detalle/:id" element={<ProductDetail />} /> 
                <Route path="/carrito" element={<ShoppingCart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Register />} />
                <Route path="/nosotros" element={<Nosotros />} />
                <Route path="/blogs" element={<Blogs />} /> 
                <Route path="/blogs/detalle/:blogId" element={<BlogDetail />} /> 
                <Route path="/contacto" element={<Contacto />} />

                {/* -------------------- RUTAS DE ADMINISTRACIÓN (ANIDADAS Y PROTEGIDAS) -------------------- */}
                {/* 1. Usamos el AdminLayout como envoltorio principal para la barra lateral */}
                <Route path="/admin" element={<AdminLayout />}>
                    
                    {/* 2. Definimos una ruta que aplica la protección. TODAS las subrutas heredarán esta protección. */}
                    <Route 
                        path="" 
                        element={<ProtectedRoute allowedRoles={['administrador']}> <Outlet /> </ProtectedRoute>}
                    >
                        {/* 3. Las rutas internas que se renderizan dentro del Outlet (AdminLayout) */}
                        <Route index element={<AdminHome />} /> 
                        <Route path="productos" element={<AdminProducts />} /> 
                        <Route path="productos/nuevo" element={<AdminProductNew />} /> 
                        <Route path="productos/editar/:id" element={<AdminProductEdit />} /> 
                        <Route path="usuarios" element={<AdminUsers />} /> 
                        <Route path="usuarios/nuevo" element={<AdminUserNew />} /> 
                        <Route path="usuarios/editar/:id" element={<AdminUserEdit />} /> 
                    </Route>
                </Route>

                {/* Ruta de Error */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </LayoutWrapper>
    </Router>
  );
}

export default App;