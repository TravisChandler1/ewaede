import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Badge,
  Icon,
} from '@chakra-ui/react';
import { useColorModeValue } from '@chakra-ui/color-mode';
import { FaClock, FaUserFriends, FaPlay, FaVideo } from 'react-icons/fa';

interface SessionCardProps {
  id: string;
  title: string;
  teacher: string;
  time: string;
  type: 'Group Session' | 'Individual Session';
  participants: number;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  level?: string;
  onJoin?: (sessionId: string) => void;
  onCancel?: (sessionId: string) => void;
}

const SessionCard: React.FC<SessionCardProps> = ({
  id,
  title,
  teacher,
  time,
  type,
  participants,
  status,
  level,
  onJoin,
  onCancel,
}) => {
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'white');
  const subtitleColor = useColorModeValue('gray.600', 'gray.400');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'blue';
      case 'ongoing':
        return 'green';
      case 'completed':
        return 'gray';
      case 'cancelled':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'Individual Session' ? 'purple' : 'blue';
  };

  const canJoin = status === 'scheduled' || status === 'ongoing';

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
            {title}
          </Text>
          <HStack gap={2}>
            <Badge colorScheme={getTypeColor(type)} size="sm">
              {type}
            </Badge>
            <Badge colorScheme={getStatusColor(status)} size="sm">
              {status}
            </Badge>
          </HStack>
        </HStack>

        <Text fontSize="xs" color={subtitleColor}>
          with {teacher}
        </Text>

        {level && (
          <Badge colorScheme="green" size="sm">
            {level} Level
          </Badge>
        )}

        <HStack justify="space-between" w="full">
          <HStack gap={4}>
            <HStack gap={1}>
              <Icon as={FaClock} color={subtitleColor} boxSize={3} />
              <Text fontSize="xs" color={subtitleColor}>
                {time}
              </Text>
            </HStack>
            <HStack gap={1}>
              <Icon as={FaUserFriends} color={subtitleColor} boxSize={3} />
              <Text fontSize="xs" color={subtitleColor}>
                {participants} {participants === 1 ? 'participant' : 'participants'}
              </Text>
            </HStack>
          </HStack>
        </HStack>

        <HStack gap={2} w="full">
          {canJoin && onJoin && (
            <Button
              size="xs"
              bg="brand.500"
              color="white"
              _hover={{ bg: 'brand.600' }}
              onClick={() => onJoin(id)}
            >
              <HStack gap={1}>
                <Icon as={status === 'ongoing' ? FaVideo : FaPlay} />
                <Text>{status === 'ongoing' ? 'Join Now' : 'Join Session'}</Text>
              </HStack>
            </Button>
          )}
          
          {status === 'scheduled' && onCancel && (
            <Button
              size="xs"
              variant="outline"
              colorScheme="red"
              onClick={() => onCancel(id)}
            >
              Cancel
            </Button>
          )}
        </HStack>
      </VStack>
    </Box>
  );
};

export default SessionCard;