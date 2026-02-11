import React from 'react';
import { createBrowserRouter } from "react-router";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <div>Hello World</div>,
  },
]);

export default Router;