import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FaClock, FaEnvelope, FaHome } from 'react-icons/fa';

const TeacherPending: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box bg="gray.900" minH="100vh" color="white" display="flex" alignItems="center">
      <Container maxW="2xl">
        <VStack gap={8} textAlign="center">
          {/* Icon */}
          <Box
            w={20}
            h={20}
            bg="orange.500"
            borderRadius="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Icon as={FaClock} boxSize={10} color="white" />
          </Box>

          {/* Main Content */}
          <VStack gap={4}>
            <Heading size="xl" color="white">
              Application Under Review
            </Heading>
            <Text fontSize="lg" color="gray.300" maxW="md">
              Thank you for applying to become a teacher at Ewa Ede Yoruba Academy!
            </Text>
          </VStack>

          {/* Status Information */}
          <Box bg="gray.800" p={6} borderRadius="lg" border="1px" borderColor="gray.700" w="full">
            <VStack gap={4}>
              <HStack gap={3}>
                <Box as={FaEnvelope} color="orange.400" />
                <Text fontWeight="bold" color="white">
                  What happens next?
                </Text>
              </HStack>
              
              <VStack gap={3} align="start" w="full">
                <Text fontSize="sm" color="gray.300">
                  • Our admin team will review your application and qualifications
                </Text>
                <Text fontSize="sm" color="gray.300">
                  • You will receive an email notification within 2-3 business days
                </Text>
                <Text fontSize="sm" color="gray.300">
                  • Once approved, you'll gain access to your teacher dashboard
                </Text>
                <Text fontSize="sm" color="gray.300">
                  • If additional information is needed, we'll contact you directly
                </Text>
              </VStack>
            </VStack>
          </Box>

          {/* Contact Information */}
          <Box bg="gray.800" p={4} borderRadius="lg" border="1px" borderColor="gray.700" w="full">
            <VStack gap={2}>
              <Text fontSize="sm" fontWeight="bold" color="white">
                Questions about your application?
              </Text>
              <Text fontSize="sm" color="gray.400">
                Contact us at: <Text as="span" color="brand.400">teachers@ewaede.com</Text>
              </Text>
            </VStack>
          </Box>

          {/* Action Buttons */}
          <VStack gap={3} w="full" maxW="sm">
            <Button
              size="lg"
              bg="brand.500"
              color="white"
              _hover={{ bg: 'brand.600' }}
              w="full"
              onClick={() => navigate('/')}
            >
              <HStack gap={2}>
                <Box as={FaHome} />
                <Text>Return to Home</Text>
              </HStack>
            </Button>
            
            <Text fontSize="xs" color="gray.500" textAlign="center">
              You can close this page. We'll email you when your application status changes.
            </Text>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default TeacherPending;