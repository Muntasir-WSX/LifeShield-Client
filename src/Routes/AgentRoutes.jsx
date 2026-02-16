import React from 'react';
import { Navigate, useLocation } from 'react-router';
import useAuth from '../Hooks/useAuth';
import useRole from '../Hooks/useRole';
import Loading from '../SharedComponents/Loading/Loading';

const AgentRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const [role, isRoleLoading] = useRole();
    const location = useLocation();

    if (loading || isRoleLoading) {
        return <Loading />;
    }

    if (user && role === 'agent') {
        return children;
    }

    return <Navigate to="/dashboard" state={{ from: location }} replace />;
};

export default AgentRoute;