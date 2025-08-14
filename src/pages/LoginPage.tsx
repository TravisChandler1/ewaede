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
  Flex,
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { useToast } from '@chakra-ui/toast';
import {
  Alert,
  AlertIcon,
} from '@chakra-ui/alert';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Animation keyframes
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, user } = useAuth();
  const toast = useToast();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const from = location.state?.from?.pathname || getDashboardRoute(user.role);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, user, navigate, location]);

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

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null); // Clear error when user starts typing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        toast({
          title: 'Login Successful!',
          description: 'Welcome back to Ewa Ede Yoruba Academy.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        
        // Navigation will be handled by the useEffect above
      } else {
        setError(result.error || 'Login failed. Please try again.');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box 
      minH="100vh" 
      py={8}
      backgroundImage="linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 10%), url('/images/auth-background.jpg')"
      backgroundSize="cover"
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      backgroundAttachment="fixed"
    >
      <Container maxW="md">
        <VStack gap={8}>
          {/* Header */}
          <VStack gap={4} textAlign="center" css={{ animation: `${fadeInUp} 0.8s ease-out` }}>
            <Heading size="xl" color="black">
              Welcome Back
            </Heading>
            <Text fontSize="lg" color="gray.600">
              Sign in to continue your Yoruba learning journey
            </Text>
            <HStack>
              <Text color="gray.600">Don't have an account?</Text>
              <Button 
                variant="ghost" 
                color="brand.500" 
                onClick={() => navigate('/signup')}
                _hover={{
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s ease'
                }}
                transition="all 0.2s ease"
              >
                Sign Up
              </Button>
            </HStack>
          </VStack>

          {/* Login Form */}
          <Box 
            as="form" 
            onSubmit={handleSubmit} 
            w="full" 
            p={8} 
            bg="rgba(249, 250, 251, 0.9)" 
            borderRadius="lg"
            backdropFilter="blur(10px)"
            border="1px"
            borderColor="rgba(255, 255, 255, 0.2)"
            css={{ animation: `${scaleIn} 0.8s ease-out 0.2s both` }}
            _hover={{
              transform: 'translateY(-4px)',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease'
            }}
            transition="all 0.3s ease"
          >
            <VStack gap={6}>
              <Heading size="md" color="black" alignSelf="start">
                Sign In
              </Heading>
              
              {error && (
                <Alert status="error" css={{ animation: `${fadeInUp} 0.3s ease-out` }}>
                  <AlertIcon />
                  {error}
                </Alert>
              )}
              
              <Box w="full">
                <Text color="black" mb={2} fontWeight="medium">Email Address</Text>
                <Input
                  type="email"
                  bg="white"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email address"
                  required
                  _focus={{
                    borderColor: 'brand.500',
                    boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
                    transform: 'scale(1.02)',
                    transition: 'all 0.2s ease'
                  }}
                  transition="all 0.2s ease"
                />
              </Box>
              
              <Box w="full">
                <Text color="black" mb={2} fontWeight="medium">Password</Text>
                <Input
                  type="password"
                  bg="white"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter your password"
                  required
                  _focus={{
                    borderColor: 'brand.500',
                    boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
                    transform: 'scale(1.02)',
                    transition: 'all 0.2s ease'
                  }}
                  transition="all 0.2s ease"
                />
              </Box>
              
              <Flex justify="space-between" w="full" align="center">
                <Text fontSize="sm" color="gray.600">
                  Remember me
                </Text>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  color="brand.500"
                  _hover={{
                    transform: 'translateY(-1px)',
                    transition: 'all 0.2s ease'
                  }}
                  transition="all 0.2s ease"
                >
                  Forgot Password?
                </Button>
              </Flex>
              
              <Button
                type="submit"
                size="lg"
                bg="brand.500"
                color="white"
                _hover={{ 
                  bg: 'brand.600',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  transition: 'all 0.2s ease'
                }}
                transition="all 0.2s ease"
                w="full"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </VStack>
          </Box>

          {/* Additional Login Options */}
          <Box 
            p={4} 
            bg="rgba(249, 250, 251, 0.8)" 
            borderRadius="lg" 
            w="full"
            backdropFilter="blur(10px)"
            border="1px"
            borderColor="rgba(255, 255, 255, 0.2)"
            css={{ animation: `${fadeInUp} 0.8s ease-out 0.4s both` }}
          >
            <VStack gap={2}>
              <Text fontSize="sm" fontWeight="bold" color="gray.800">
                Need Help?
              </Text>
              <Text fontSize="sm" color="gray.600" textAlign="center">
                Contact our support team at support@ewaedeyoruba.com for assistance with your account.
              </Text>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default LoginPage;