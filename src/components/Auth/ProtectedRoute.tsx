import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, Spinner, VStack, Text } from '@chakra-ui/react';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'STUDENT' | 'TEACHER' | 'ADMIN';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Box 
        minH="100vh" 
        display="flex" 
        alignItems="center" 
        justifyContent="center"
        bg="gray.50"
      >
        <VStack gap={4}>
          <Spinner size="xl" color="brand.500" />
          <Text color="gray.600">Loading...</Text>
        </VStack>
      </Box>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // Redirect based on user role
    switch (user?.role) {
      case 'STUDENT':
        return <Navigate to="/student-dashboard" replace />;
      case 'TEACHER':
        // Check if teacher is approved
        if (user.teacherStatus === 'PENDING') {
          return <Navigate to="/teacher-pending" replace />;
        }
        return <Navigate to="/teacher-dashboard" replace />;
      case 'ADMIN':
        return <Navigate to="/admin-dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  // For teachers, check if they're approved (except for pending page)
  if (user?.role === 'TEACHER' && 
      user.teacherStatus === 'PENDING' && 
      !location.pathname.includes('pending')) {
    return <Navigate to="/teacher-pending" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;