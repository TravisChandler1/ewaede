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
  Select,
  Flex,
  Grid,
  Badge,
} from '@chakra-ui/react';
import { useToast } from '@chakra-ui/toast';
import {
  Alert,
  AlertIcon,
} from '@chakra-ui/alert';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaChalkboardTeacher, FaGraduationCap, FaUsers } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'STUDENT' | 'TEACHER';
  learningLevel?: 'NOVICE' | 'BEGINNER' | 'ADVANCED' | 'PRO';
  teachingType?: 'INDIVIDUAL' | 'GROUP';
}

const SignUpPage: React.FC = () => {
  const [formData, setFormData] = useState<SignUpFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'STUDENT',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { signup, isAuthenticated, user } = useAuth();
  const toast = useToast();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const dashboardRoute = getDashboardRoute(user.role);
      navigate(dashboardRoute, { replace: true });
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

  const handleInputChange = (field: keyof SignUpFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null); // Clear error when user starts typing
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (formData.role === 'STUDENT' && !formData.learningLevel) {
      setError('Please select a learning level');
      return false;
    }

    if (formData.role === 'STUDENT' && !formData.teachingType) {
      setError('Please select a learning style');
      return false;
    }

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
      const result = await signup({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role,
        learningLevel: formData.learningLevel,
        teachingType: formData.teachingType,
      });

      if (result.success) {
        toast({
          title: 'Account Created Successfully!',
          description: formData.role === 'TEACHER' 
            ? 'Your teacher application has been submitted for review. You will receive an email notification once approved.'
            : 'Welcome to Ewa Ede Yoruba Academy! You can now start learning.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });

        // Navigation will be handled by the useEffect above
      } else {
        setError(result.error || 'Failed to create account. Please try again.');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const learningLevels = [
    {
      value: 'NOVICE',
      name: 'Novice',
      price: '$29/month',
      description: 'Perfect for absolute beginners',
      features: ['Basic vocabulary', 'Simple greetings', 'Audio pronunciation'],
    },
    {
      value: 'BEGINNER',
      name: 'Beginner',
      price: '$49/month',
      description: 'Build on basic knowledge',
      features: ['Grammar basics', 'Common phrases', 'Interactive exercises'],
    },
    {
      value: 'ADVANCED',
      name: 'Advanced',
      price: '$79/month',
      description: 'Develop fluency and cultural understanding',
      features: ['Complex grammar', 'Conversation practice', 'Cultural context'],
      popular: true,
    },
    {
      value: 'PRO',
      name: 'Pro',
      price: '$129/month',
      description: 'Master the language completely',
      features: ['Fluency training', 'Literature study', 'Teaching certification'],
    },
  ];

  return (
    <Box 
      minH="100vh" 
      py={8}
      backgroundImage="linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%), url('/images/auth-background.jpg')"
      backgroundSize="cover"
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      backgroundAttachment="fixed"
    >
      <Container maxW="4xl">
        <VStack gap={8}>
          {/* Header */}
          <VStack gap={4} textAlign="center">
            <Heading size="xl" color="black">
              Join Ewa Ede Yoruba Academy
            </Heading>
            <Text fontSize="lg" color="gray.600">
              Start your journey to master the beautiful Yoruba language
            </Text>
            <HStack>
              <Text color="gray.600">Already have an account?</Text>
              <Button variant="ghost" color="brand.500" onClick={() => navigate('/login')}>
                Sign In
              </Button>
            </HStack>
          </VStack>

          <Box as="form" onSubmit={handleSubmit} w="full" maxW="2xl">
            <VStack gap={6}>
              {/* Personal Information */}
              <Box w="full" p={6} bg="gray.50" borderRadius="lg">
                <VStack gap={4} align="start">
                  <Heading size="md" color="black">
                    Personal Information
                  </Heading>
                  
                  <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4} w="full">
                    <Box>
                      <Text color="black" mb={2} fontWeight="medium">First Name *</Text>
                      <Input
                        bg="white"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        placeholder="Enter your first name"
                        required
                      />
                    </Box>
                    
                    <Box>
                      <Text color="black" mb={2} fontWeight="medium">Last Name *</Text>
                      <Input
                        bg="white"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        placeholder="Enter your last name"
                        required
                      />
                    </Box>
                  </Grid>
                  
                  <Box>
                    <Text color="black" mb={2} fontWeight="medium">Email Address *</Text>
                    <Input
                      type="email"
                      bg="white"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter your email address"
                      required
                    />
                  </Box>
                  
                  <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4} w="full">
                    <Box>
                      <Text color="black" mb={2} fontWeight="medium">Password *</Text>
                      <Input
                        type="password"
                        bg="white"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        placeholder="Create a password"
                        required
                      />
                    </Box>
                    
                    <Box>
                      <Text color="black" mb={2} fontWeight="medium">Confirm Password *</Text>
                      <Input
                        type="password"
                        bg="white"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        placeholder="Confirm your password"
                        required
                      />
                    </Box>
                  </Grid>
                </VStack>
              </Box>

              {/* Role Selection */}
              <Box w="full" p={6} bg="gray.50" borderRadius="lg">
                <VStack gap={4} align="start">
                  <Heading size="md" color="black">
                    Choose Your Role
                  </Heading>
                  
                  <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4} w="full">
                    <Box
                      p={4}
                      bg="white"
                      borderRadius="lg"
                      border="2px"
                      borderColor={formData.role === 'STUDENT' ? 'brand.500' : 'gray.200'}
                      cursor="pointer"
                      onClick={() => handleInputChange('role', 'STUDENT')}
                      _hover={{ borderColor: 'brand.300' }}
                    >
                      <VStack align="start" gap={2}>
                        <HStack>
                          <Box as={FaGraduationCap} color="brand.500" />
                          <Text fontWeight="bold" color="black">Student</Text>
                          {formData.role === 'STUDENT' && (
                            <Box w={3} h={3} bg="brand.500" borderRadius="full" />
                          )}
                        </HStack>
                        <Text fontSize="sm" color="gray.600">
                          Learn Yoruba at your own pace with personalized guidance
                        </Text>
                      </VStack>
                    </Box>
                    
                    <Box
                      p={4}
                      bg="white"
                      borderRadius="lg"
                      border="2px"
                      borderColor={formData.role === 'TEACHER' ? 'brand.500' : 'gray.200'}
                      cursor="pointer"
                      onClick={() => handleInputChange('role', 'TEACHER')}
                      _hover={{ borderColor: 'brand.300' }}
                    >
                      <VStack align="start" gap={2}>
                        <HStack>
                          <Box as={FaChalkboardTeacher} color="brand.500" />
                          <Text fontWeight="bold" color="black">Teacher</Text>
                          {formData.role === 'TEACHER' && (
                            <Box w={3} h={3} bg="brand.500" borderRadius="full" />
                          )}
                        </HStack>
                        <Text fontSize="sm" color="gray.600">
                          Share your expertise and teach Yoruba to eager learners
                        </Text>
                      </VStack>
                    </Box>
                  </Grid>
                </VStack>
              </Box>

              {/* Student-specific options */}
              {formData.role === 'STUDENT' && (
                <React.Fragment>
                  {/* Learning Level Selection */}
                  <Box w="full" p={6} bg="gray.50" borderRadius="lg">
                    <VStack gap={4} align="start">
                      <Heading size="md" color="black">
                        Choose Your Learning Level
                      </Heading>
                      
                      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4} w="full">
                        {learningLevels.map((level) => (
                          <Box
                            key={level.value}
                            p={4}
                            bg="white"
                            borderRadius="lg"
                            border="2px"
                            borderColor={formData.learningLevel === level.value ? 'brand.500' : 'gray.200'}
                            position="relative"
                            cursor="pointer"
                            onClick={() => handleInputChange('learningLevel', level.value as any)}
                            _hover={{ borderColor: 'brand.300' }}
                          >
                            {level.popular && (
                              <Badge
                                position="absolute"
                                top="-8px"
                                right="8px"
                                bg="brand.500"
                                color="white"
                                px={2}
                                py={1}
                                borderRadius="full"
                                fontSize="xs"
                              >
                                Popular
                              </Badge>
                            )}
                            <VStack align="start" gap={2}>
                              <HStack justify="space-between" w="full">
                                <HStack>
                                  <Text fontWeight="bold" color="black">{level.name}</Text>
                                  {formData.learningLevel === level.value && (
                                    <Box w={3} h={3} bg="brand.500" borderRadius="full" />
                                  )}
                                </HStack>
                                <Text fontWeight="bold" color="brand.500">{level.price}</Text>
                              </HStack>
                              <Text fontSize="sm" color="gray.600">
                                {level.description}
                              </Text>
                              <VStack align="start" gap={1}>
                                {level.features.map((feature, index) => (
                                  <Text key={index} fontSize="xs" color="gray.500">
                                    • {feature}
                                  </Text>
                                ))}
                              </VStack>
                            </VStack>
                          </Box>
                        ))}
                      </Grid>
                    </VStack>
                  </Box>

                  {/* Teaching Type Selection */}
                  <Box w="full" p={6} bg="gray.50" borderRadius="lg">
                    <VStack gap={4} align="start">
                      <Heading size="md" color="black">
                        Choose Your Learning Style
                      </Heading>
                      
                      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4} w="full">
                        <Box
                          p={4}
                          bg="white"
                          borderRadius="lg"
                          border="2px"
                          borderColor={formData.teachingType === 'INDIVIDUAL' ? 'brand.500' : 'gray.200'}
                          cursor="pointer"
                          onClick={() => handleInputChange('teachingType', 'INDIVIDUAL')}
                          _hover={{ borderColor: 'brand.300' }}
                        >
                          <VStack align="start" gap={2}>
                            <HStack>
                              <Box as={FaUser} color="brand.500" />
                              <Text fontWeight="bold" color="black">Individual Learning</Text>
                              {formData.teachingType === 'INDIVIDUAL' && (
                                <Box w={3} h={3} bg="brand.500" borderRadius="full" />
                              )}
                            </HStack>
                            <Text fontSize="sm" color="gray.600">
                              One-on-one sessions with personalized attention
                            </Text>
                            <VStack align="start" gap={1}>
                              <Text fontSize="xs" color="gray.500">• Customized pace</Text>
                              <Text fontSize="xs" color="gray.500">• Direct feedback</Text>
                              <Text fontSize="xs" color="gray.500">• Flexible scheduling</Text>
                            </VStack>
                          </VStack>
                        </Box>
                        
                        <Box
                          p={4}
                          bg="white"
                          borderRadius="lg"
                          border="2px"
                          borderColor={formData.teachingType === 'GROUP' ? 'brand.500' : 'gray.200'}
                          cursor="pointer"
                          onClick={() => handleInputChange('teachingType', 'GROUP')}
                          _hover={{ borderColor: 'brand.300' }}
                        >
                          <VStack align="start" gap={2}>
                            <HStack>
                              <Box as={FaUsers} color="brand.500" />
                              <Text fontWeight="bold" color="black">Group Learning</Text>
                              {formData.teachingType === 'GROUP' && (
                                <Box w={3} h={3} bg="brand.500" borderRadius="full" />
                              )}
                            </HStack>
                            <Text fontSize="sm" color="gray.600">
                              Learn with peers in interactive group sessions
                            </Text>
                            <VStack align="start" gap={1}>
                              <Text fontSize="xs" color="gray.500">• Peer interaction</Text>
                              <Text fontSize="xs" color="gray.500">• Cost-effective</Text>
                              <Text fontSize="xs" color="gray.500">• Group activities</Text>
                            </VStack>
                          </VStack>
                        </Box>
                      </Grid>
                    </VStack>
                  </Box>
                </React.Fragment>
              )}

              {/* Error Display */}
              {error && (
                <Alert status="error">
                  <AlertIcon />
                  {error}
                </Alert>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                bg="brand.500"
                color="white"
                _hover={{ bg: 'brand.600' }}
                w="full"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default SignUpPage;