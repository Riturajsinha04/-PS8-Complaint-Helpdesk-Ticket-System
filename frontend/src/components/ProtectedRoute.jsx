import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ user, children, requiredRole }){
    if(!user){
        return <Navigate to="/login" replace />
    }
    if(requiredRole && user .role !== requiredRole){
        return <Navigate to="/tickets" replace />;
    }
    return children;
}
