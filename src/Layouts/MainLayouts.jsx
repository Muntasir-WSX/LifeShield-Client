import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../SharedComponents/Navbar/Navbar';
import Footer from '../SharedComponents/Footer/Footer';

const MainLayouts = () => {
    return (
        <div>
            <Navbar></Navbar>
            <Outlet></Outlet>
            <Footer></Footer>
        </div>
    );
};

export default MainLayouts;