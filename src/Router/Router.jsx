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
import AdminRoute from "../Routes/AdminRoutes";
import AgentRoute from "../Routes/AgentRoutes";


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
      { path: "quote", element: <PrivateRoutes><QuotePage /> </PrivateRoutes> },
      { path: "quote/:id", element: <PrivateRoutes><QuotePage /> </PrivateRoutes> },
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
      { path: "manage-applications", element: <AdminRoute><ManageApplications /></AdminRoute>  },
      { path: "manage-users", element: <AdminRoute><ManageUsers /></AdminRoute>  },
      { path: "manage-policies", element:  <AdminRoute><ManagePolicies /></AdminRoute> },
      { path: "manage-transactions", element: <AdminRoute><Transactions /> </AdminRoute>},
      { path: "manage-blogs", element: <AdminRoute><AllBlogs /></AdminRoute> },

      // --- Agent Routes ---
      {path:"assigned-customers" ,element:<AgentRoute><AssignedCustomers></AssignedCustomers></AgentRoute>},
      {path:"agent-blogs" ,element: <AgentRoute><MyBlogs></MyBlogs></AgentRoute>},
      {path:"policy-clearance" ,element: <AgentRoute><PolicyClearance></PolicyClearance></AgentRoute>},

    ],
  },
  { path: "signIn", element: <SignIn /> },
  { path: "register", element: <Register /> },
]);

export default Router;