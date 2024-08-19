import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../../subgrantee_portal/layout/Header';
import Footer from '../../subgrantee_portal/layout/Footer';
const SubgranteeLayout = () => (
    <div>
    <Header/>
    <div className="page-content">
  
     <Outlet/>
    </div>
    <Footer/>
     
   </div>
);

export default SubgranteeLayout;
