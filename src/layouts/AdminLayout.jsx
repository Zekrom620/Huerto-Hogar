import React from 'react';
import { Outlet } from 'react-router-dom'; // Importamos Outlet
import AdminSidebar from '../components/admin/AdminSidebar';

const AdminLayout = () => {
    return (
        <div className="body"> 
            <AdminSidebar />

            <main className="main"> {/* Usamos main en lugar de div */}
                {/* El contenido de la sub-ruta (ej: AdminProducts) se renderiza aquí */}
                <Outlet /> 
            </main>
        </div>
    );
};

export default AdminLayout;