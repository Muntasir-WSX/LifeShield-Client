import React from 'react';
import { createBrowserRouter } from "react-router"; 
import MainLayouts from '../Layouts/MainLayouts'; 
import Home from '../Pages/Home/Home';
import ArticleDetails from '../Pages/Home/Article/ArticleDetails';

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
        path: "blog-details",
        element: <div>Blogs Page</div>, 
      },
      {
          path: 'blog-details/:id',
          element: <ArticleDetails></ArticleDetails>
      },
    ],
  },
]);

export default Router;