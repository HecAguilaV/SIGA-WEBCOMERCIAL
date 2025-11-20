import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { ChartBar, Users, CheckCircle, Package } from 'phosphor-react';

// Layout administrativo con barra lateral usando Bootstrap
export default function AdminLayout() {
  return (
    <div className="container-fluid">
      <div className="row">
        <aside className="col-12 col-md-3 col-lg-2 bg-light border-end min-vh-100 py-4">
          <div className="px-3 mb-3">
            <h5 className="text-primario">Panel Admin</h5>
          </div>
          <nav className="nav flex-column px-3">
            <NavLink end to="/admin" className="nav-link">
              <ChartBar size={18} weight="fill" className="me-2" style={{ verticalAlign: 'middle' }} />
              Dashboard
            </NavLink>
            <NavLink to="/admin/usuarios" className="nav-link">
              <Users size={18} weight="fill" className="me-2" style={{ verticalAlign: 'middle' }} />
              Usuarios
            </NavLink>
            <NavLink to="/admin/suscripciones" className="nav-link">
              <CheckCircle size={18} weight="fill" className="me-2" style={{ verticalAlign: 'middle' }} />
              Suscripciones
            </NavLink>
            <NavLink to="/admin/planes" className="nav-link">
              <Package size={18} weight="fill" className="me-2" style={{ verticalAlign: 'middle' }} />
              Planes
            </NavLink>
          </nav>
        </aside>
        <section className="col-12 col-md-9 col-lg-10 p-4">
          <Outlet />
        </section>
      </div>
    </div>
  );
}


