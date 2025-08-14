import React, { ReactNode } from 'react';
import {
  Box,
  Container,
  Flex,
  HStack,
  VStack,
  Heading,
  Text,
  Button,
  Badge,
} from '@chakra-ui/react';
import { useColorModeValue } from '@chakra-ui/color-mode';
import { Avatar } from '@chakra-ui/avatar';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaBell, FaCog } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  title, 
  subtitle 
}) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const headerBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'STUDENT':
        return 'green';
      case 'TEACHER':
        return 'blue';
      case 'ADMIN':
        return 'purple';
      default:
        return 'gray';
    }
  };

  return (
    <Box bg={bgColor} minH="100vh">
      {/* Header */}
      <Box bg={headerBg} py={4} borderBottom="1px" borderColor={borderColor} shadow="sm">
        <Container maxW="7xl">
          <Flex justify="space-between" align="center">
            <HStack gap={4}>
              <Avatar
                size="md"
                name={user ? `${user.firstName} ${user.lastName}` : ''}
                src={user?.avatar}
                bg="brand.500"
                color="white"
              />
              <VStack align="start" gap={0}>
                <Heading size="md" color="gray.800">
                  {title}
                </Heading>
                {subtitle && (
                  <Text fontSize="sm" color="gray.600">
                    {subtitle}
                  </Text>
                )}
              </VStack>
            </HStack>
            
            <HStack gap={4}>
              <Button
                variant="ghost"
                size="sm"
                color="gray.600"
                _hover={{ color: 'gray.800', bg: 'gray.100' }}
              >
                <FaBell />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                color="gray.600"
                _hover={{ color: 'gray.800', bg: 'gray.100' }}
              >
                <FaCog />
              </Button>
              
              <Badge 
                colorScheme={getRoleColor(user?.role || '')} 
                px={3} 
                py={1} 
                borderRadius="full"
                textTransform="capitalize"
              >
                {user?.role.toLowerCase()}
              </Badge>
              
              <Button
                variant="ghost"
                size="sm"
                color="gray.600"
                _hover={{ color: 'red.500', bg: 'red.50' }}
                onClick={handleLogout}
              >
                <HStack gap={2}>
                  <FaSignOutAlt />
                  <Text>Logout</Text>
                </HStack>
              </Button>
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="7xl" py={8}>
        {children}
      </Container>
    </Box>
  );
};

export default DashboardLayout;