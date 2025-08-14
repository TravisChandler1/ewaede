import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Input,
  Icon,
} from '@chakra-ui/react';
import { useToast } from '@chakra-ui/toast';
import {
  Alert,
  AlertIcon,
} from '@chakra-ui/alert';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaShieldAlt, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

interface AdminLoginFormData {
  email: string;
  password: string;
}

const AdminLoginPage: React.FC = () => {
  const [formData, setFormData] = useState<AdminLoginFormData>({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, user } = useAuth();
  const toast = useToast();

  // Redirect if already authenticated as admin
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'ADMIN') {
        navigate('/admin-dashboard', { replace: true });
      } else {
        // Not an admin, redirect to appropriate dashboard
        const dashboardRoute = getDashboardRoute(user.role);
        navigate(dashboardRoute, { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const getDashboardRoute = (role: string) => {
    switch (role) {
      case 'STUDENT':
        return '/student-dashboard';
      case 'TEACHER':
        return '/teacher-dashboard';
      case 'ADMIN':
        return '/admin-dashboard';
      default:
        return '/';
    }
  };

  const handleInputChange = (field: keyof AdminLoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        // Check if user is admin after login
        // This will be handled by the useEffect above
        toast({
          title: 'Admin Login Successful!',
          description: 'Welcome to the admin dashboard.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        setError(result.error || 'Invalid admin credentials. Please try again.');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box bg="gray.900" minH="100vh" py={8}>
      <Container maxW="md">
        <VStack gap={8}>
          {/* Back to Home Button */}
          <HStack w="full" justify="start">
            <Button
              variant="ghost"
              color="gray.400"
              _hover={{ color: 'white', bg: 'gray.800' }}
              onClick={() => navigate('/')}
            >
              <HStack gap={2}>
                <FaArrowLeft />
                <Text>Back to Home</Text>
              </HStack>
            </Button>
          </HStack>

          {/* Header */}
          <VStack gap={4} textAlign="center">
            <Box
              w={16}
              h={16}
              bg="red.500"
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="white"
            >
              <Icon as={FaShieldAlt} boxSize={8} />
            </Box>
            <Heading size="xl" color="white">
              Admin Access
            </Heading>
            <Text fontSize="lg" color="gray.400">
              Secure login for system administrators
            </Text>
          </VStack>

          {/* Login Form */}
          <Box as="form" onSubmit={handleSubmit} w="full" p={8} bg="gray.800" borderRadius="lg" border="1px" borderColor="gray.700">
            <VStack gap={6}>
              <Heading size="md" color="white" alignSelf="start">
                Administrator Sign In
              </Heading>
              
              {error && (
                <Alert status="error" bg="red.900" borderColor="red.700">
                  <AlertIcon color="red.400" />
                  <Text color="red.200">{error}</Text>
                </Alert>
              )}
              
              <Box w="full">
                <Text color="gray.300" mb={2} fontWeight="medium">Admin Email</Text>
                <Input
                  type="email"
                  bg="gray.700"
                  borderColor="gray.600"
                  color="white"
                  _placeholder={{ color: 'gray.400' }}
                  _hover={{ borderColor: 'gray.500' }}
                  _focus={{ borderColor: 'red.500', boxShadow: '0 0 0 1px #EF4444' }}
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter admin email address"
                  required
                />
              </Box>
              
              <Box w="full">
                <Text color="gray.300" mb={2} fontWeight="medium">Password</Text>
                <Input
                  type="password"
                  bg="gray.700"
                  borderColor="gray.600"
                  color="white"
                  _placeholder={{ color: 'gray.400' }}
                  _hover={{ borderColor: 'gray.500' }}
                  _focus={{ borderColor: 'red.500', boxShadow: '0 0 0 1px #EF4444' }}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter admin password"
                  required
                />
              </Box>
              
              <Button
                type="submit"
                size="lg"
                bg="red.500"
                color="white"
                _hover={{ bg: 'red.600' }}
                _active={{ bg: 'red.700' }}
                w="full"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Access Admin Panel'}
              </Button>
            </VStack>
          </Box>

          {/* Security Notice */}
          <Box p={4} bg="gray.800" borderRadius="lg" w="full" border="1px" borderColor="gray.700">
            <VStack gap={2}>
              <Text fontSize="sm" fontWeight="bold" color="red.400">
                🔒 Security Notice
              </Text>
              <Text fontSize="sm" color="gray.400" textAlign="center">
                This is a restricted area. All access attempts are logged and monitored.
                Only authorized administrators should access this page.
              </Text>
            </VStack>
          </Box>

          {/* Setup Link */}
          <Box textAlign="center">
            <Text fontSize="sm" color="gray.500">
              First time setup?{' '}
              <Button
                variant="ghost"
                color="red.400"
                fontSize="sm"
                onClick={() => navigate('/admin-setup')}
                p={0}
                h="auto"
                minH="auto"
              >
                Configure Admin Account
              </Button>
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default AdminLoginPage;