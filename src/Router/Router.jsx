import React from 'react';
import { createBrowserRouter } from "react-router"; // বা react-router-dom
import MainLayouts from '../Layouts/MainLayouts'; // তোমার পাথ অনুযায়ী ইমপোর্ট করো

const Router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayouts />, // এখানে মেইন লেআউট থাকবে
    children: [
      {
        path: "/",
        element: <div>Hello World (Home Page Content)</div>, // ডক অনুযায়ী হোম পেজের কন্টেন্ট এখানে আসবে
      },
      {
        path: "policies",
        element: <div>All Policies Page</div>, // ডক অনুযায়ী All Policies রুট
      },
      {
        path: "blogs",
        element: <div>Blogs Page</div>, // ডক অনুযায়ী Blogs রুট
      },
    ],
  },
]);

export default Router;