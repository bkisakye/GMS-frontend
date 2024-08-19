import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidemenu from './Sidemenu';
import Footer from './Footer';

const AdminLayout = () => (
    
  <div>
   <Header/>
   <div className="page-content">
    <Sidemenu/>
    <Outlet/>
   </div>
   <Footer/>
    
  </div>
);

export default AdminLayout;