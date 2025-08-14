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
  Grid,
} from '@chakra-ui/react';
import { Divider } from '@chakra-ui/layout';
import { useToast } from '@chakra-ui/toast';
import {
  Alert,
  AlertIcon,
} from '@chakra-ui/alert';
import { Progress } from '@chakra-ui/progress';
import { useNavigate } from 'react-router-dom';
import { FaShieldAlt, FaUser, FaEnvelope, FaLock, FaCheck, FaArrowLeft } from 'react-icons/fa';
import { supabase } from '../utils/supabase';

interface AdminSetupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const AdminSetupPage: React.FC = () => {
  const [formData, setFormData] = useState<AdminSetupFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [adminExists, setAdminExists] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const toast = useToast();

  // Check if admin already exists
  useEffect(() => {
    checkAdminExists();
  }, []);

  const checkAdminExists = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('role', 'ADMIN')
        .limit(1);

      if (error) {
        console.error('Error checking admin:', error);
        setAdminExists(false);
        return;
      }

      setAdminExists(data && data.length > 0);
    } catch (error) {
      console.error('Error checking admin:', error);
      setAdminExists(false);
    }
  };

  const handleInputChange = (field: keyof AdminSetupFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setError('First name is required');
      return false;
    }
    if (!formData.lastName.trim()) {
      setError('Last name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // Create admin user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      if (!authData.user) {
        setError('Failed to create admin account');
        return;
      }

      // Create admin profile in users table
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: formData.email,
          password: '', // We don't store the actual password
          firstName: formData.firstName,
          lastName: formData.lastName,
          role: 'ADMIN',
        });

      if (profileError) {
        setError(profileError.message);
        // Clean up auth user if profile creation fails
        await supabase.auth.signOut();
        return;
      }

      setIsSetupComplete(true);
      toast({
        title: 'Admin Account Created!',
        description: 'Your administrator account has been successfully configured.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Redirect to admin login after 3 seconds
      setTimeout(() => {
        navigate('/admin-login');
      }, 3000);

    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // If admin already exists, show message
  if (adminExists === true) {
    return (
      <Box bg="gray.900" minH="100vh" py={8}>
        <Container maxW="md">
          <VStack gap={8}>
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

            <VStack gap={6} textAlign="center">
              <Box
                w={16}
                h={16}
                bg="yellow.500"
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
                color="white"
              >
                <Icon as={FaShieldAlt} boxSize={8} />
              </Box>
              <Heading size="xl" color="white">
                Setup Already Complete
              </Heading>
              <Text fontSize="lg" color="gray.400" maxW="md">
                An administrator account has already been configured for this system.
              </Text>
              <Button
                bg="red.500"
                color="white"
                _hover={{ bg: 'red.600' }}
                onClick={() => navigate('/admin-login')}
              >
                Go to Admin Login
              </Button>
            </VStack>
          </VStack>
        </Container>
      </Box>
    );
  }

  // Loading state while checking admin
  if (adminExists === null) {
    return (
      <Box bg="gray.900" minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <VStack gap={4}>
          <Progress size="lg" isIndeterminate colorScheme="red" w="200px" />
          <Text color="gray.400">Checking system status...</Text>
        </VStack>
      </Box>
    );
  }

  // Setup complete state
  if (isSetupComplete) {
    return (
      <Box bg="gray.900" minH="100vh" py={8}>
        <Container maxW="md">
          <VStack gap={8} textAlign="center">
            <Box
              w={20}
              h={20}
              bg="green.500"
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="white"
            >
              <Icon as={FaCheck} boxSize={10} />
            </Box>
            <Heading size="xl" color="white">
              Setup Complete!
            </Heading>
            <Text fontSize="lg" color="gray.400" maxW="md">
              Your administrator account has been successfully created. You will be redirected to the login page shortly.
            </Text>
            <Progress value={100} colorScheme="green" w="full" />
            <Text fontSize="sm" color="gray.500">
              Redirecting to admin login...
            </Text>
          </VStack>
        </Container>
      </Box>
    );
  }

  return (
    <Box bg="gray.900" minH="100vh" py={8}>
      <Container maxW="lg">
        <VStack gap={8}>
          {/* Back Button */}
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
              Admin Account Setup
            </Heading>
            <Text fontSize="lg" color="gray.400" maxW="2xl">
              Configure the first administrator account for Ewa Ede Yoruba Academy.
              This is a one-time setup process.
            </Text>
          </VStack>

          {/* Setup Form */}
          <Box as="form" onSubmit={handleSubmit} w="full" maxW="2xl">
            <VStack gap={6}>
              <Box w="full" p={8} bg="gray.800" borderRadius="lg" border="1px" borderColor="gray.700">
                <VStack gap={6}>
                  <Heading size="md" color="white" alignSelf="start">
                    Administrator Details
                  </Heading>
                  
                  {error && (
                    <Alert status="error" bg="red.900" borderColor="red.700">
                      <AlertIcon color="red.400" />
                      <Text color="red.200">{error}</Text>
                    </Alert>
                  )}
                  
                  <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4} w="full">
                    <Box>
                      <HStack mb={2}>
                        <Icon as={FaUser} color="gray.400" />
                        <Text color="gray.300" fontWeight="medium">First Name</Text>
                      </HStack>
                      <Input
                        bg="gray.700"
                        borderColor="gray.600"
                        color="white"
                        _placeholder={{ color: 'gray.400' }}
                        _hover={{ borderColor: 'gray.500' }}
                        _focus={{ borderColor: 'red.500', boxShadow: '0 0 0 1px #EF4444' }}
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        placeholder="Enter first name"
                        required
                      />
                    </Box>
                    
                    <Box>
                      <HStack mb={2}>
                        <Icon as={FaUser} color="gray.400" />
                        <Text color="gray.300" fontWeight="medium">Last Name</Text>
                      </HStack>
                      <Input
                        bg="gray.700"
                        borderColor="gray.600"
                        color="white"
                        _placeholder={{ color: 'gray.400' }}
                        _hover={{ borderColor: 'gray.500' }}
                        _focus={{ borderColor: 'red.500', boxShadow: '0 0 0 1px #EF4444' }}
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        placeholder="Enter last name"
                        required
                      />
                    </Box>
                  </Grid>
                  
                  <Box w="full">
                    <HStack mb={2}>
                      <Icon as={FaEnvelope} color="gray.400" />
                      <Text color="gray.300" fontWeight="medium">Admin Email</Text>
                    </HStack>
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
                  
                  <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4} w="full">
                    <Box>
                      <HStack mb={2}>
                        <Icon as={FaLock} color="gray.400" />
                        <Text color="gray.300" fontWeight="medium">Password</Text>
                      </HStack>
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
                        placeholder="Create secure password"
                        required
                      />
                    </Box>
                    
                    <Box>
                      <HStack mb={2}>
                        <Icon as={FaLock} color="gray.400" />
                        <Text color="gray.300" fontWeight="medium">Confirm Password</Text>
                      </HStack>
                      <Input
                        type="password"
                        bg="gray.700"
                        borderColor="gray.600"
                        color="white"
                        _placeholder={{ color: 'gray.400' }}
                        _hover={{ borderColor: 'gray.500' }}
                        _focus={{ borderColor: 'red.500', boxShadow: '0 0 0 1px #EF4444' }}
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        placeholder="Confirm password"
                        required
                      />
                    </Box>
                  </Grid>
                </VStack>
              </Box>

              {/* Security Requirements */}
              <Box w="full" p={6} bg="gray.800" borderRadius="lg" border="1px" borderColor="gray.700">
                <VStack gap={4} align="start">
                  <Heading size="sm" color="red.400">
                    🔒 Security Requirements
                  </Heading>
                  <VStack gap={2} align="start">
                    <Text fontSize="sm" color="gray.400">
                      • Password must be at least 8 characters long
                    </Text>
                    <Text fontSize="sm" color="gray.400">
                      • Use a strong, unique password for security
                    </Text>
                    <Text fontSize="sm" color="gray.400">
                      • This account will have full system access
                    </Text>
                    <Text fontSize="sm" color="gray.400">
                      • Keep these credentials secure and confidential
                    </Text>
                  </VStack>
                </VStack>
              </Box>

              <Divider borderColor="gray.700" />

              {/* Submit Button */}
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
                {isLoading ? 'Creating Admin Account...' : 'Create Administrator Account'}
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default AdminSetupPage;