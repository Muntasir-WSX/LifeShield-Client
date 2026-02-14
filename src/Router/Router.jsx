import React from "react";
import { createBrowserRouter } from "react-router";
import MainLayouts from "../Layouts/MainLayouts";
import Home from "../Pages/Home/Home";
import ArticleDetails from "../Pages/Home/Article/ArticleDetails";
import Blogs from "../Pages/Blogs/Blogs";
import SignIn from "../Pages/AuthPages/SignIn/SignIn";
import Register from "../Pages/AuthPages/Register/Register";
import PrivateRoutes from "../Routes/PrivateRoutes";
import AllPolicies from "../Pages/AllPolicies/AllPolicies";
import AllPoliciesDetails from "../Pages/AllPolicies/AllPoliciesDetails";
import QuotePage from "../Pages/QuotePage/QuotePage";
import QuoteApplicationFrom from "../Pages/QuotePage/QuoteApplicationForm";
import Profile from "../Pages/Profile/Profile";
import DashboardLayout from "../Layouts/DashboardLayout";
import MyPolicies from "../Pages/Customer/MyPolicies/MyPolicies";
import PaymentStatus from "../Pages/Customer/PaymentStatus/PaymentStatus";
import ClaimRequest from "../Pages/Customer/ClaimRequest/ClaimRequest";
import PaymentPage from "../Pages/Customer/PaymentPage/PaymentPage";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayouts />,
    children: [
      {
        path: "/",
        Component: Home,
      },
      {
        path: "policies",
        element: <AllPolicies></AllPolicies>,
      },
      {
        path: "policy/:id",
        element: (
          <PrivateRoutes>
            <AllPoliciesDetails></AllPoliciesDetails>
          </PrivateRoutes>
        ),
      },
      {
        path: "blogs",
        element: <Blogs></Blogs>,
      },
      {
        path: "quote",
        element: <QuotePage />,
      },
      {
        path: "quote/:id",
        element: <QuotePage />,
      },
      {
        path: "apply",
        element: (
          <PrivateRoutes>
            <QuoteApplicationFrom></QuoteApplicationFrom>
          </PrivateRoutes>
        ),
      },
      {
        path: "blog-details/:id",
        element: <ArticleDetails></ArticleDetails>,
      },
      {
        path: "profile",
        element: (
          <PrivateRoutes>
            <Profile />
          </PrivateRoutes>
        ),
      },
    ],
  },
  {
    path: "dashboard",
    element: (
      <PrivateRoutes>
        <DashboardLayout></DashboardLayout>
      </PrivateRoutes>
    ),
    children: [
      { path: "my-policies", 
        element: <MyPolicies></MyPolicies>
      },
      { path: "payment/:id", 
        element: <PaymentPage></PaymentPage>
      }, 
      // {
      //   path:"payment-page",
      //   element:
      // },
      { path: "payment-status", 
        element: <PaymentStatus></PaymentStatus> 
      },
    
      { path: "claim-request", 
        element: <ClaimRequest></ClaimRequest>
      },
      
    ],
  },
  // auth routes

  {
    path: "signIn",
    element: <SignIn></SignIn>,
  },
  {
    path: "register",
    element: <Register></Register>,
  },
]);

export default Router;
