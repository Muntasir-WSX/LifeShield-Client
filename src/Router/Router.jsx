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
import AboutUs from "../Pages/AboutUs/AboutUs";
import ManageApplications from "../Pages/Admin/ManageApplications/ManageApplications";
import ManageUsers from "../Pages/Admin/ManageUsers/ManageUsers";
import ManagePolicies from "../Pages/Admin/ManagePolicies/ManagePolicies";
import Transactions from "../Pages/Admin/Transactions/Transactions";
import AllBlogs from "../Pages/Admin/AllBlogs/AllBlogs";

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
          path: "us",
          element:<AboutUs></AboutUs>
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
      { 
      index: true, 
      element: <MyPolicies /> 
    },
      { path: "my-policies", 
        element: <MyPolicies></MyPolicies> //customer route
      },
      { path: "payment/:id", 
        element: <PaymentPage></PaymentPage> //customer route
      }, 
      { path: "payment-status", 
        element: <PaymentStatus></PaymentStatus> //customer route
      },
    
      { path: "claim-request", 
        element: <ClaimRequest></ClaimRequest>  //customer route
      },
      {
        path:"manage-applications",
        element:<ManageApplications></ManageApplications>
      },
      {
        path:"manage-users",
        element:<ManageUsers></ManageUsers>
      },
      {
        path:"manage-policies",
        element:<ManagePolicies></ManagePolicies>
      },
      {
        path:"manage-transactions",
        element:<Transactions></Transactions>
      },
      {
        path:"manage-blogs",
        element:<AllBlogs></AllBlogs>
      }
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
