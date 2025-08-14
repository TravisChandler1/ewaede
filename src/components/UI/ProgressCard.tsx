import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Flex,
  Progress,
} from '@chakra-ui/react';
import { useColorModeValue } from '@chakra-ui/color-mode';

interface ProgressCardProps {
  title: string;
  level: string;
  completedLessons: number;
  totalLessons: number;
  progressPercentage: number;
  description?: string;
  onContinue?: () => void;
  buttonText?: string;
}

const ProgressCard: React.FC<ProgressCardProps> = ({
  title,
  level,
  completedLessons,
  totalLessons,
  progressPercentage,
  description,
  onContinue,
  buttonText = 'Continue Learning',
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const subtitleColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Box
      bg={bgColor}
      p={6}
      borderRadius="lg"
      border="1px"
      borderColor={borderColor}
      shadow="sm"
    >
      <VStack gap={4} align="start" w="full">
        <VStack gap={2} align="start" w="full">
          <Text fontSize="lg" fontWeight="bold" color={textColor}>
            {title}
          </Text>
          {description && (
            <Text fontSize="sm" color={subtitleColor}>
              {description}
            </Text>
          )}
        </VStack>

        <Box w="full">
          <Flex justify="space-between" mb={2}>
            <Text fontSize="sm" color={subtitleColor}>
              {level} Level Progress
            </Text>
            <Text fontSize="sm" color="brand.500" fontWeight="bold">
              {progressPercentage}%
            </Text>
          </Flex>
          <Progress.Root 
            value={progressPercentage} 
            size='md' 
            colorScheme="green"
          >
            <Progress.Track />
            <Progress.Range />
          </Progress.Root>
        </Box>

        <HStack justify="space-between" w="full">
          <VStack gap={0} align="start">
            <Text fontSize="xs" color={subtitleColor}>
              Lessons Completed
            </Text>
            <Text fontSize="sm" fontWeight="bold" color={textColor}>
              {completedLessons} / {totalLessons}
            </Text>
          </VStack>
          
          {onContinue && (
            <Button
              size="sm"
              bg="brand.500"
              color="white"
              _hover={{ bg: 'brand.600' }}
              onClick={onContinue}
            >
              {buttonText}
            </Button>
          )}
        </HStack>
      </VStack>
    </Box>
  );
};

export default ProgressCard;