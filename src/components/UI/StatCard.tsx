import React from 'react';
import {
  Box,
  VStack,
  Text,
  Icon,
} from '@chakra-ui/react';
import { useColorModeValue } from '@chakra-ui/color-mode';
import { IconType } from 'react-icons';

interface StatCardProps {
  icon: IconType;
  title: string;
  value: string | number;
  color: string;
  subtitle?: string;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  title,
  value,
  color,
  subtitle,
  onClick,
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
      cursor={onClick ? 'pointer' : 'default'}
      _hover={onClick ? { shadow: 'md', transform: 'translateY(-2px)' } : {}}
      transition="all 0.2s"
      onClick={onClick}
    >
      <VStack gap={3} align="center">
        <Icon as={icon} boxSize={8} color={color} />
        <VStack gap={1} align="center">
          <Text fontSize="2xl" fontWeight="bold" color={textColor}>
            {value}
          </Text>
          <Text fontSize="sm" color={subtitleColor} textAlign="center">
            {title}
          </Text>
          {subtitle && (
            <Text fontSize="xs" color={subtitleColor} textAlign="center">
              {subtitle}
            </Text>
          )}
        </VStack>
      </VStack>
    </Box>
  );
};

export default StatCard;