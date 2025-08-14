import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Grid,
  Input,
  Flex,
  Badge,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import {
  FaBook,
  FaUsers,
  FaVideo,
  FaBookOpen,
  FaGraduationCap,
  FaChalkboardTeacher,
  FaCheckCircle,
  FaShieldAlt,
} from 'react-icons/fa';
import { keyframes } from '@emotion/react';

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

const fadeInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const fadeInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
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

const HomePage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const navigate = useNavigate();

  const handleNewsletterSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribing(true);
    
    // Simulate API call
    setTimeout(() => {
      alert('Successfully subscribed! Thank you for subscribing to our newsletter.');
      setEmail('');
      setIsSubscribing(false);
    }, 1000);
  };

  const features = [
    {
      icon: FaGraduationCap,
      title: 'Personalized Learning',
      description: 'Track your progress through Novice, Beginner, Advanced, and Pro levels',
    },
    {
      icon: FaUsers,
      title: 'Group Learning',
      description: 'Join or create study groups with fellow learners',
    },
    {
      icon: FaBook,
      title: 'Book Club',
      description: 'Participate in Yoruba literature discussions and reading sessions',
    },
    {
      icon: FaBookOpen,
      title: 'E-Library Access',
      description: 'Access comprehensive Yoruba learning resources and materials',
    },
    {
      icon: FaVideo,
      title: 'Live Sessions',
      description: 'Join interactive live classes with experienced teachers',
    },
    {
      icon: FaChalkboardTeacher,
      title: 'Expert Teachers',
      description: 'Learn from qualified and experienced Yoruba language instructors',
    },
  ];

  const pricingPlans = [
    {
      level: 'Novice',
      price: '$29',
      features: ['Basic vocabulary', 'Simple greetings', 'Audio pronunciation', 'Community access'],
      color: 'green.100',
      textColor: 'green.800',
    },
    {
      level: 'Beginner',
      price: '$49',
      features: ['Grammar basics', 'Common phrases', 'Interactive exercises', 'Group sessions', 'E-library access'],
      color: 'green.200',
      textColor: 'green.800',
    },
    {
      level: 'Advanced',
      price: '$79',
      features: ['Complex grammar', 'Conversation practice', 'Cultural context', 'Book club access', 'Live sessions'],
      color: 'green.300',
      textColor: 'green.800',
      popular: true,
    },
    {
      level: 'Pro',
      price: '$129',
      features: ['Fluency training', 'Literature study', 'One-on-one sessions', 'Teaching certification', 'All features'],
      color: 'green.400',
      textColor: 'green.800',
    },
  ];

  return (
    <Box bg="white" minH="100vh">
      {/* Header */}
      <Box 
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex={1000}
        bg="rgb(20, 20, 20)"
        backdropFilter="blur(10px)"
        borderBottom="1px" 
        borderColor="rgba(255, 255, 255, 0.2)"
        py={4}
        animation={`${fadeInUp} 0.8s ease-out`}
      >
        <Container maxW="7xl">
          <Flex justify="space-between" align="center">
            <Heading 
              size="lg" 
              color="black"
              animation={`${fadeInLeft} 0.8s ease-out`}
            >
              Ewa Ede Yoruba Academy
            </Heading>
            <HStack gap={4} animation={`${fadeInRight} 0.8s ease-out`}>
              <Button 
                variant="ghost" 
                color="black" 
                onClick={() => navigate('/login')}
                _hover={{ 
                  transform: 'translateY(-2px)',
                  bg: 'rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.2s ease'
                }}
                transition="all 0.2s ease"
              >
                Login
              </Button>
              <Button 
                bg="brand.500" 
                color="white" 
                _hover={{ 
                  bg: 'brand.600',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  transition: 'all 0.2s ease'
                }}
                transition="all 0.2s ease"
                onClick={() => navigate('/signup')}
              >
                Sign Up
              </Button>
              <Button
                variant="ghost"
                color="gray.600"
                _hover={{ 
                  color: 'red.500', 
                  bg: 'red.50',
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s ease'
                }}
                transition="all 0.2s ease"
                onClick={() => navigate('/admin-login')}
                title="Admin Access"
              >
                <FaShieldAlt />
              </Button>
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box
        position="relative"
        py={20}
        pt={32}
        bg="black"
        backgroundImage="linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 100%), url('/images/hero-background.jpg')"
        backgroundSize="cover"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundAttachment="fixed"
      >
        <Container maxW="7xl" position="relative" zIndex={2}>
          <VStack gap={8} textAlign="center">
            <Heading 
              size="2xl" 
              color="white" 
              maxW="4xl"
              animation={`${fadeInUp} 1s ease-out 0.2s both`}
            >
              Master the Beautiful Yoruba Language with Expert Guidance
            </Heading>
            <Text 
              fontSize="xl" 
              color="gray.200" 
              maxW="3xl"
              animation={`${fadeInUp} 1s ease-out 0.4s both`}
            >
              Connect with the rich heritage of Yoruba culture through our comprehensive online academy.
              From foundational greetings to advanced literary analysis, we provide structured learning paths
              guided by native speakers and cultural experts.
            </Text>
            <HStack gap={4} animation={`${fadeInUp} 1s ease-out 0.6s both`}>
              <Button
                size="lg"
                bg="brand.500"
                color="white"
                _hover={{ 
                  bg: 'brand.600',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                transition="all 0.3s ease"
                onClick={() => navigate('/signup')}
              >
                Begin Your Journey
              </Button>
              <Button
                size="lg"
                variant="outline"
                color="white"
                borderColor="white"
                _hover={{ 
                  bg: 'whiteAlpha.200',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 6px 20px rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.3s ease'
                }}
                transition="all 0.3s ease"
              >
                Explore Courses
              </Button>
            </HStack>
          </VStack>
        </Container>
      </Box>

      {/* Features Section */}
      <Box bg="gray.50" py={20}>
        <Container maxW="7xl">
          <VStack gap={12}>
            <VStack gap={4} textAlign="center" animation={`${fadeInUp} 1s ease-out`}>
              <Heading size="xl" color="black">
                Everything You Need to Learn Yoruba
              </Heading>
              <Text fontSize="lg" color="gray.600" maxW="3xl">
                Our comprehensive platform provides all the tools and resources you need for your Yoruba learning journey.
              </Text>
            </VStack>
            
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={8}>
              {features.map((feature, index) => (
                <Box 
                  key={index} 
                  bg="white" 
                  p={6} 
                  borderRadius="lg" 
                  shadow="md"
                  animation={`${scaleIn} 0.6s ease-out ${0.1 * index}s both`}
                  _hover={{
                    transform: 'translateY(-8px)',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                    transition: 'all 0.3s ease'
                  }}
                  transition="all 0.3s ease"
                  cursor="pointer"
                >
                  <VStack gap={4} align="start">
                    <Box 
                      as={feature.icon} 
                      boxSize={8} 
                      color="brand.500"
                      transition="all 0.3s ease"
                      _groupHover={{ transform: 'scale(1.1)' }}
                    />
                    <Heading size="md" color="black">
                      {feature.title}
                    </Heading>
                    <Text color="gray.600">
                      {feature.description}
                    </Text>
                  </VStack>
                </Box>
              ))}
            </Grid>
          </VStack>
        </Container>
      </Box>

      {/* Pricing Section */}
      <Box bg="white" py={20}>
        <Container maxW="7xl">
          <VStack gap={12}>
            <VStack gap={4} textAlign="center" animation={`${fadeInUp} 1s ease-out`}>
              <Heading size="xl" color="black">
                Choose Your Learning Path
              </Heading>
              <Text fontSize="lg" color="gray.600" maxW="3xl">
                Select the perfect plan for your Yoruba learning journey. All plans include access to our community and basic resources.
              </Text>
            </VStack>
            
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6}>
              {pricingPlans.map((plan, index) => (
                <Box 
                  key={index} 
                  bg={plan.color} 
                  p={6} 
                  borderRadius="lg" 
                  shadow="lg" 
                  position="relative"
                  animation={`${scaleIn} 0.6s ease-out ${0.1 * index}s both`}
                  _hover={{
                    transform: plan.popular ? 'translateY(-12px) scale(1.02)' : 'translateY(-8px)',
                    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
                    transition: 'all 0.3s ease'
                  }}
                  transition="all 0.3s ease"
                  cursor="pointer"
                >
                  {plan.popular && (
                    <Badge 
                      position="absolute" 
                      top="-10px" 
                      left="50%" 
                      transform="translateX(-50%)"
                      bg="brand.500" 
                      color="white" 
                      px={3} 
                      py={1}
                      borderRadius="full"
                      animation={`${scaleIn} 0.6s ease-out 0.5s both`}
                    >
                      Most Popular
                    </Badge>
                  )}
                  <VStack gap={4} align="start">
                    <VStack gap={2} align="start" w="full">
                      <Heading size="md" color={plan.textColor}>
                        {plan.level}
                      </Heading>
                      <Text fontSize="3xl" fontWeight="bold" color={plan.textColor}>
                        {plan.price}
                        <Text as="span" fontSize="sm" fontWeight="normal">
                          /month
                        </Text>
                      </Text>
                    </VStack>
                    
                    <VStack gap={2} w="full" align="start">
                      {plan.features.map((feature, featureIndex) => (
                        <Box key={featureIndex} color={plan.textColor} display="flex" alignItems="center">
                          <Box as={FaCheckCircle} color="brand.500" mr={2} />
                          <Text>{feature}</Text>
                        </Box>
                      ))}
                    </VStack>
                    
                    <Button 
                      w="full" 
                      bg="brand.500" 
                      color="white" 
                      _hover={{ 
                        bg: 'brand.600',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        transition: 'all 0.2s ease'
                      }}
                      transition="all 0.2s ease"
                      onClick={() => navigate('/signup')}
                    >
                      Get Started
                    </Button>
                  </VStack>
                </Box>
              ))}
            </Grid>
          </VStack>
        </Container>
      </Box>

      {/* Teaching Options */}
      <Box bg="gray.50" py={20}>
        <Container maxW="7xl">
          <VStack gap={12}>
            <VStack gap={4} textAlign="center" animation={`${fadeInUp} 1s ease-out`}>
              <Heading size="xl" color="black">
                Choose How You Want to Learn
              </Heading>
              <Text fontSize="lg" color="gray.600" maxW="3xl">
                Whether you prefer one-on-one attention or the energy of group learning, we have options for you.
              </Text>
            </VStack>
            
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={8}>
              <Box 
                bg="white" 
                p={8} 
                borderRadius="lg" 
                shadow="lg"
                animation={`${fadeInLeft} 0.8s ease-out 0.2s both`}
                _hover={{
                  transform: 'translateY(-8px)',
                  boxShadow: '0 15px 35px rgba(0, 0, 0, 0.15)',
                  transition: 'all 0.3s ease'
                }}
                transition="all 0.3s ease"
                cursor="pointer"
              >
                <VStack gap={6} align="start">
                  <Box 
                    as={FaChalkboardTeacher} 
                    boxSize={12} 
                    color="brand.500"
                    transition="all 0.3s ease"
                    _groupHover={{ transform: 'scale(1.1)' }}
                  />
                  <VStack gap={3} align="start">
                    <Heading size="lg" color="black">
                      Individual Teaching
                    </Heading>
                    <Text color="gray.600" fontSize="lg">
                      Get personalized attention with one-on-one sessions tailored to your learning pace and style.
                    </Text>
                    <VStack gap={2} align="start">
                      <Box color="gray.600" display="flex" alignItems="center">
                        <Box as={FaCheckCircle} color="brand.500" mr={2} />
                        <Text>Customized lesson plans</Text>
                      </Box>
                      <Box color="gray.600" display="flex" alignItems="center">
                        <Box as={FaCheckCircle} color="brand.500" mr={2} />
                        <Text>Flexible scheduling</Text>
                      </Box>
                      <Box color="gray.600" display="flex" alignItems="center">
                        <Box as={FaCheckCircle} color="brand.500" mr={2} />
                        <Text>Direct teacher feedback</Text>
                      </Box>
                    </VStack>
                  </VStack>
                </VStack>
              </Box>
              
              <Box 
                bg="white" 
                p={8} 
                borderRadius="lg" 
                shadow="lg"
                animation={`${fadeInRight} 0.8s ease-out 0.4s both`}
                _hover={{
                  transform: 'translateY(-8px)',
                  boxShadow: '0 15px 35px rgba(0, 0, 0, 0.15)',
                  transition: 'all 0.3s ease'
                }}
                transition="all 0.3s ease"
                cursor="pointer"
              >
                <VStack gap={6} align="start">
                  <Box 
                    as={FaUsers} 
                    boxSize={12} 
                    color="brand.500"
                    transition="all 0.3s ease"
                    _groupHover={{ transform: 'scale(1.1)' }}
                  />
                  <VStack gap={3} align="start">
                    <Heading size="lg" color="black">
                      Group Teaching
                    </Heading>
                    <Text color="gray.600" fontSize="lg">
                      Learn alongside peers in interactive group sessions that foster community and collaboration.
                    </Text>
                    <VStack gap={2} align="start">
                      <Box color="gray.600" display="flex" alignItems="center">
                        <Box as={FaCheckCircle} color="brand.500" mr={2} />
                        <Text>Interactive group activities</Text>
                      </Box>
                      <Box color="gray.600" display="flex" alignItems="center">
                        <Box as={FaCheckCircle} color="brand.500" mr={2} />
                        <Text>Peer learning opportunities</Text>
                      </Box>
                      <Box color="gray.600" display="flex" alignItems="center">
                        <Box as={FaCheckCircle} color="brand.500" mr={2} />
                        <Text>Cost-effective learning</Text>
                      </Box>
                    </VStack>
                  </VStack>
                </VStack>
              </Box>
            </Grid>
          </VStack>
        </Container>
      </Box>

      {/* Newsletter Section */}
      <Box bg="black" py={20}>
        <Container maxW="7xl">
          <VStack gap={8} textAlign="center">
            <VStack gap={4}>
              <Heading size="xl" color="white">
                Join Our Learning Community
              </Heading>
              <Text fontSize="lg" color="gray.300" maxW="3xl">
                Subscribe to receive weekly Yoruba lessons, cultural insights, pronunciation guides,
                and exclusive access to our community events and workshops.
              </Text>
            </VStack>
            
            <Box as="form" onSubmit={handleNewsletterSubscription} maxW="md" w="full">
              <HStack gap={4}>
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  bg="white"
                  color="black"
                  _placeholder={{ color: 'gray.500' }}
                  required
                />
                <Button
                  type="submit"
                  bg="brand.500"
                  color="white"
                  _hover={{ bg: 'brand.600' }}
                  disabled={isSubscribing}
                >
                  {isSubscribing ? 'Subscribing...' : 'Subscribe'}
                </Button>
              </HStack>
            </Box>
          </VStack>
        </Container>
      </Box>

      {/* Footer */}
      <Box bg="gray.900" py={12}>
        <Container maxW="7xl">
          <VStack gap={8}>
            <Box w="full" h="1px" bg="gray.700" />
            <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={8} w="full">
              <VStack gap={4} align="start">
                <Heading size="md" color="white">
                  Ewa Ede Yoruba Academy
                </Heading>
                <Text color="gray.400">
                  Empowering learners worldwide to master the beautiful Yoruba language through innovative online education.
                </Text>
              </VStack>
              
              <VStack gap={4} align="start">
                <Heading size="sm" color="white">
                  Quick Links
                </Heading>
                <VStack gap={2} align="start">
                  <Text color="gray.400" cursor="pointer" _hover={{ color: 'white' }}>
                    About Us
                  </Text>
                  <Text color="gray.400" cursor="pointer" _hover={{ color: 'white' }}>
                    Courses
                  </Text>
                  <Text color="gray.400" cursor="pointer" _hover={{ color: 'white' }}>
                    Teachers
                  </Text>
                  <Text color="gray.400" cursor="pointer" _hover={{ color: 'white' }}>
                    Contact
                  </Text>
                </VStack>
              </VStack>
              
              <VStack gap={4} align="start">
                <Heading size="sm" color="white">
                  Contact Info
                </Heading>
                <VStack gap={2} align="start">
                  <Text color="gray.400">
                    Email: info@ewaedeyoruba.com
                  </Text>
                  <Text color="gray.400">
                    Phone: +234 (0) 123 456 7890
                  </Text>
                </VStack>
              </VStack>
            </Grid>
            
            <Box w="full" h="1px" bg="gray.700" />
            <Text color="gray.400" textAlign="center">
              © 2024 Ewa Ede Yoruba Academy. All rights reserved.
            </Text>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;