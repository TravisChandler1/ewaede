import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Badge,
  Icon,
  Progress,
} from '@chakra-ui/react';
import { useColorModeValue } from '@chakra-ui/color-mode';
import { FaUsers, FaClock } from 'react-icons/fa';

interface GroupCardProps {
  id: string;
  name: string;
  description?: string;
  members: number;
  maxMembers?: number;
  level: string;
  lastActivity: string;
  progress?: number;
  isJoined?: boolean;
  onJoin?: (groupId: string) => void;
  onLeave?: (groupId: string) => void;
  onView?: (groupId: string) => void;
}

const GroupCard: React.FC<GroupCardProps> = ({
  id,
  name,
  description,
  members,
  maxMembers = 20,
  level,
  lastActivity,
  progress,
  isJoined = false,
  onJoin,
  onLeave,
  onView,
}) => {
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'white');
  const subtitleColor = useColorModeValue('gray.600', 'gray.400');
  const progressBgColor = useColorModeValue('gray.200', 'gray.600');

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'novice':
        return 'green';
      case 'beginner':
        return 'blue';
      case 'advanced':
        return 'purple';
      case 'pro':
        return 'orange';
      default:
        return 'gray';
    }
  };

  return (
    <Box
      bg={bgColor}
      p={4}
      borderRadius="lg"
      border="1px"
      borderColor={borderColor}
      shadow="sm"
      w="full"
    >
      <VStack gap={3} align="start" w="full">
        <HStack justify="space-between" w="full">
          <Text fontWeight="bold" color={textColor} fontSize="sm">
            {name}
          </Text>
          <Badge colorScheme={getLevelColor(level)} size="sm">
            {level}
          </Badge>
        </HStack>

        {description && (
          <Text fontSize="xs" color={subtitleColor} lineClamp={2}>
            {description}
          </Text>
        )}

        <HStack justify="space-between" w="full">
          <HStack gap={1}>
            <Icon as={FaUsers} color={subtitleColor} boxSize={3} />
            <Text fontSize="xs" color={subtitleColor}>
              {members}/{maxMembers} members
            </Text>
          </HStack>
          <HStack gap={1}>
            <Icon as={FaClock} color={subtitleColor} boxSize={3} />
            <Text fontSize="xs" color={subtitleColor}>
              Active {lastActivity}
            </Text>
          </HStack>
        </HStack>

        {progress !== undefined && (
          <Box w="full">
            <HStack justify="space-between" mb={1}>
              <Text fontSize="xs" color={subtitleColor}>
                Group Progress
              </Text>
              <Text fontSize="xs" color="brand.500" fontWeight="bold">
                {progress}%
              </Text>
            </HStack>
            <Progress.Root
              value={progress}
              colorScheme="green"
              size="sm"
            >
              <Progress.Track />
              <Progress.Range />
            </Progress.Root>
          </Box>
        )}

        <HStack gap={2} w="full">
          {onView && (
            <Button
              size="xs"
              variant="outline"
              borderColor="brand.500"
              color="brand.500"
              _hover={{ bg: 'brand.500', color: 'white' }}
              onClick={() => onView(id)}
              flex={1}
            >
              View Group
            </Button>
          )}
          
          {!isJoined && onJoin && members < maxMembers && (
            <Button
              size="xs"
              bg="brand.500"
              color="white"
              _hover={{ bg: 'brand.600' }}
              onClick={() => onJoin(id)}
              flex={1}
            >
              Join Group
            </Button>
          )}
          
          {isJoined && onLeave && (
            <Button
              size="xs"
              variant="outline"
              colorScheme="red"
              onClick={() => onLeave(id)}
              flex={1}
            >
              Leave Group
            </Button>
          )}
        </HStack>
      </VStack>
    </Box>
  );
};

export default GroupCard;