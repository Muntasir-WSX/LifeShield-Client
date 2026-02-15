import React from "react";
import { createBrowserRouter, Navigate } from "react-router";
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
import useRole from "../Hooks/useRole"; 
import AssignedCustomers from "../Pages/Agent/Assigned Customers/AssignedCustomers";
import MyBlogs from "../Pages/Agent/My Blogs/MyBlogs";
import PolicyClearance from "../Pages/Agent/Policy Clearance/PolicyClearance";
import Loading from "../SharedComponents/Loading/Loading";


const DashboardIndex = () => {
  const [role, isLoading] = useRole(); 

  if (isLoading) return Loading;


  if (role === "admin") {
    return <Navigate to="/dashboard/manage-applications" replace />;
  }
  if (role === "agent") return <Navigate to="/dashboard/assigned-customers" replace />;
  
  return <Navigate to="/dashboard/my-policies" replace />;
};

const Router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayouts />,
    children: [
      { index: true, element: <Home /> },
      { path: "policies", element: <AllPolicies /> },
      {
        path: "policy/:id",
        element: (
          <PrivateRoutes>
            <AllPoliciesDetails />
          </PrivateRoutes>
        ),
      },
      { path: "blogs", element: <Blogs /> },
      { path: "quote", element: <QuotePage /> },
      { path: "quote/:id", element: <QuotePage /> },
      {
        path: "apply",
        element: (
          <PrivateRoutes>
            <QuoteApplicationFrom />
          </PrivateRoutes>
        ),
      },
      { path: "us", element: <AboutUs /> },
      { path: "blog-details/:id", element: <ArticleDetails /> },
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
        <DashboardLayout />
      </PrivateRoutes>
    ),
    children: [
      
      { index: true, element: <DashboardIndex /> },
      
      // --- Customer Routes ---
      { path: "my-policies", element: <MyPolicies /> },
      { path: "payment/:id", element: <PaymentPage /> },
      { path: "payment-status", element: <PaymentStatus /> },
      { path: "claim-request", element: <ClaimRequest /> },

      // --- Admin Routes ---
      { path: "manage-applications", element: <ManageApplications /> },
      { path: "manage-users", element: <ManageUsers /> },
      { path: "manage-policies", element: <ManagePolicies /> },
      { path: "manage-transactions", element: <Transactions /> },
      { path: "manage-blogs", element: <AllBlogs /> },

      // --- Agent Routes ---
      {path:"assigned-customers" ,element:<AssignedCustomers></AssignedCustomers>},
      {path:"agent-blogs" ,element:<MyBlogs></MyBlogs>},
      {path:"policy-clearance" ,element:<PolicyClearance></PolicyClearance>},

    ],
  },
  { path: "signIn", element: <SignIn /> },
  { path: "register", element: <Register /> },
]);

export default Router;