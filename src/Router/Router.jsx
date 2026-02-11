import React from 'react';
import { createBrowserRouter } from "react-router"; 
import MainLayouts from '../Layouts/MainLayouts'; 
import Home from '../Pages/Home/Home';

const Router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayouts />, 
    children: [
      {
        path: "/",
        Component:Home
      },
      {
        path: "policies",
        element: <div>All Policies Page</div>, 
      },
      {
        path: "blogs",
        element: <div>Blogs Page</div>, 
      },
    ],
  },
]);

export default Router;