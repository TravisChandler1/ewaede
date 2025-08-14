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
  Badge,
  Flex,
  Stack,
  Select,
  Spinner,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import {
  FaUsers,
  FaVideo,
  FaChalkboardTeacher,
  FaChartLine,
  FaClock,
  FaCalendarAlt,
  FaPlay,
  FaUserFriends,
  FaSignOutAlt,
  FaPlus,
  FaEdit,
  FaStar,
  FaBookOpen,
} from 'react-icons/fa';
import { useTeacherData } from '../hooks/useUserData';

const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { teacherData, loading, createSession, updateGroup } = useTeacherData();

  const handleLogout = () => {
    navigate('/');
  };

  const handleCreateSession = () => {
    if (!teacherData) return;
    
    const newSession = {
      id: Date.now().toString(),
      title: 'New Yoruba Session',
      teacher: `${teacherData.firstName} ${teacherData.lastName}`,
      time: 'Tomorrow, 2:00 PM',
      type: 'Group Session' as const,
      participants: 0,
      status: 'scheduled' as const,
      level: 'Beginner' as const,
    };
    
    createSession(newSession);
    alert('New session created successfully!');
  };

  if (loading) {
    return (
      <Box bg="gray.900" minH="100vh" color="white" display="flex" alignItems="center" justifyContent="center">
        <VStack gap={4}>
          <Spinner size="xl" color="brand.500" />
          <Text>Loading your dashboard...</Text>
        </VStack>
      </Box>
    );
  }

  if (!teacherData) {
    return (
      <Box bg="gray.900" minH="100vh" color="white" display="flex" alignItems="center" justifyContent="center">
        <Text>Error loading teacher data</Text>
      </Box>
    );
  }

  const stats = [
    {
      icon: FaUsers,
      title: 'Total Students',
      value: teacherData.totalStudents.toString(),
      color: 'blue.400',
      change: '+5 this week',
    },
    {
      icon: FaVideo,
      title: 'Live Sessions',
      value: teacherData.liveSessions.toString(),
      color: 'green.400',
      change: `${teacherData.upcomingSessions.length} upcoming`,
    },
    {
      icon: FaChartLine,
      title: 'Average Rating',
      value: teacherData.rating.toString(),
      color: 'yellow.400',
      change: '⭐ Excellent',
    },
    {
      icon: FaClock,
      title: 'Teaching Hours',
      value: `${teacherData.teachingHours}h`,
      color: 'purple.400',
      change: 'This month',
    },
  ];

  return (
    <Box bg="gray.900" minH="100vh" color="white">
      {/* Header */}
      <Box bg="gray.800" py={4} borderBottom="1px" borderColor="gray.700">
        <Container maxW="7xl">
          <Flex justify="space-between" align="center">
            <HStack gap={4}>
              <Box
                w={12}
                h={12}
                bg="brand.500"
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
                color="white"
                fontWeight="bold"
              >
                TO
              </Box>
              <VStack align="start" gap={0}>
                <Heading size="md" color="white">
                  Welcome, Teacher {teacherData.lastName}!
                </Heading>
                <Text fontSize="sm" color="gray.400">
                  Manage your classes and students
                </Text>
              </VStack>
            </HStack>
            <HStack gap={4}>
              <Badge colorScheme="purple" px={3} py={1} borderRadius="full">
                Expert Teacher
              </Badge>
              <Button
                variant="ghost"
                color="gray.300"
                _hover={{ color: 'white', bg: 'gray.700' }}
                onClick={handleLogout}
              >
                <HStack gap={2}>
                  <Box as={FaSignOutAlt} />
                  <Text>Logout</Text>
                </HStack>
              </Button>
            </HStack>
          </Flex>
        </Container>
      </Box>

      <Container maxW="7xl" py={8}>
        <VStack gap={8} align="stretch">
          {/* Stats Cards */}
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6}>
            {stats.map((stat, index) => (
              <Box key={index} bg="gray.800" p={6} borderRadius="lg" border="1px" borderColor="gray.700">
                <VStack gap={3}>
                  <Box as={stat.icon} boxSize={8} color={stat.color} />
                  <VStack gap={1}>
                    <Text fontSize="2xl" fontWeight="bold" color="white">
                      {stat.value}
                    </Text>
                    <Text fontSize="sm" color="gray.400" textAlign="center">
                      {stat.title}
                    </Text>
                    <Text fontSize="xs" color={stat.color} textAlign="center">
                      {stat.change}
                    </Text>
                  </VStack>
                </VStack>
              </Box>
            ))}
          </Grid>

          {/* Quick Actions */}
          <Box bg="gray.800" p={6} borderRadius="lg" border="1px" borderColor="gray.700">
            <VStack gap={4} align="start">
              <Heading size="md" color="white">
                Quick Actions
              </Heading>
              <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={4} w="full">
                <Button bg="brand.500" color="white" _hover={{ bg: 'brand.600' }} onClick={handleCreateSession}>
                  <HStack gap={2}>
                    <Box as={FaPlus} />
                    <Text>Create Session</Text>
                  </HStack>
                </Button>
                <Button variant="outline" borderColor="brand.500" color="white" _hover={{ bg: 'brand.500', color: 'white' }}>
                  <HStack gap={2}>
                    <Box as={FaUsers} />
                    <Text>Manage Groups</Text>
                  </HStack>
                </Button>
                <Button variant="outline" borderColor="gray.500" color="gray.300" _hover={{ bg: 'gray.700', color: 'white' }}>
                  <HStack gap={2}>
                    <Box as={FaBookOpen} />
                    <Text>Add Resources</Text>
                  </HStack>
                </Button>
                <Button variant="outline" borderColor="gray.500" color="gray.300" _hover={{ bg: 'gray.700', color: 'white' }}>
                  <HStack gap={2}>
                    <Box as={FaChartLine} />
                    <Text>View Analytics</Text>
                  </HStack>
                </Button>
              </Grid>
            </VStack>
          </Box>

          <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={8}>
            {/* Upcoming Sessions */}
            <Box bg="gray.800" p={6} borderRadius="lg" border="1px" borderColor="gray.700">
              <VStack gap={4} align="start">
                <HStack justify="space-between" w="full">
                  <Heading size="md" color="white">
                    Upcoming Sessions
                  </Heading>
                  <Button size="sm" variant="ghost" color="brand.400">
                    Schedule New
                  </Button>
                </HStack>
                
                <VStack gap={3} w="full">
                  {teacherData.upcomingSessions.map((session, index) => (
                    <Box key={index} p={4} bg="gray.700" borderRadius="lg" w="full">
                      <VStack gap={2} align="start">
                        <HStack justify="space-between" w="full">
                          <Text fontWeight="bold" color="white" fontSize="sm">
                            {session.title}
                          </Text>
                          <Badge colorScheme={session.level === 'Beginner' ? 'green' : session.level === 'Advanced' ? 'purple' : 'blue'} size="sm">
                            {session.level}
                          </Badge>
                        </HStack>
                        <HStack justify="space-between" w="full">
                          <HStack gap={2}>
                            <Box as={FaClock} color="gray.400" boxSize={3} />
                            <Text fontSize="xs" color="gray.400">
                              {session.time}
                            </Text>
                          </HStack>
                          <HStack gap={2}>
                            <Box as={FaUserFriends} color="gray.400" boxSize={3} />
                            <Text fontSize="xs" color="gray.400">
                              {session.participants} students
                            </Text>
                          </HStack>
                        </HStack>
                        <HStack gap={2} w="full">
                          <Button size="xs" bg="brand.500" color="white" _hover={{ bg: 'brand.600' }}>
                            <HStack gap={1}>
                              <Box as={FaPlay} boxSize={2} />
                              <Text>Start Session</Text>
                            </HStack>
                          </Button>
                          <Button size="xs" variant="outline" borderColor="gray.500" color="gray.300">
                            <HStack gap={1}>
                              <Box as={FaEdit} boxSize={2} />
                              <Text>Edit</Text>
                            </HStack>
                          </Button>
                        </HStack>
                      </VStack>
                    </Box>
                  ))}
                </VStack>
              </VStack>
            </Box>

            {/* My Groups */}
            <Box bg="gray.800" p={6} borderRadius="lg" border="1px" borderColor="gray.700">
              <VStack gap={4} align="start">
                <HStack justify="space-between" w="full">
                  <Heading size="md" color="white">
                    My Groups
                  </Heading>
                  <Button size="sm" variant="ghost" color="brand.400">
                    Create Group
                  </Button>
                </HStack>
                
                <VStack gap={3} w="full">
                  {teacherData.myGroups.map((group, index) => (
                    <Box key={index} p={4} bg="gray.700" borderRadius="lg" w="full">
                      <VStack gap={2} align="start">
                        <HStack justify="space-between" w="full">
                          <Text fontWeight="bold" color="white" fontSize="sm">
                            {group.name}
                          </Text>
                          <Badge colorScheme={group.level === 'Beginner' ? 'green' : group.level === 'Advanced' ? 'purple' : 'blue'} size="sm">
                            {group.level}
                          </Badge>
                        </HStack>
                        <HStack justify="space-between" w="full">
                          <HStack gap={2}>
                            <Box as={FaUsers} color="gray.400" boxSize={3} />
                            <Text fontSize="xs" color="gray.400">
                              {group.members} members
                            </Text>
                          </HStack>
                          <Text fontSize="xs" color="gray.400">
                            Active {group.lastActivity}
                          </Text>
                        </HStack>
                        <Box w="full">
                          <Flex justify="space-between" mb={1}>
                            <Text fontSize="xs" color="gray.400">Group Progress</Text>
                            <Text fontSize="xs" color="brand.400">{group.progress}%</Text>
                          </Flex>
                          <Box w="full" bg="gray.600" h={2} borderRadius="full" overflow="hidden">
                            <Box 
                              bg="green.400" 
                              h="full" 
                              w={`${group.progress}%`} 
                              borderRadius="full"
                              transition="width 0.3s ease"
                            />
                          </Box>
                        </Box>
                        <Button size="xs" variant="outline" borderColor="brand.500" color="brand.400" _hover={{ bg: 'brand.500', color: 'white' }}>
                          Manage Group
                        </Button>
                      </VStack>
                    </Box>
                  ))}
                </VStack>
              </VStack>
            </Box>
          </Grid>

          <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={8}>
            {/* Student Categories */}
            <Box bg="gray.800" p={6} borderRadius="lg" border="1px" borderColor="gray.700">
              <VStack gap={4} align="start">
                <HStack justify="space-between" w="full">
                  <Heading size="md" color="white">
                    Students by Level
                  </Heading>
                  <Box position="relative" maxW="120px">
                    <select
                      style={{
                        backgroundColor: '#2D3748',
                        border: '1px solid #4A5568',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '14px',
                        width: '100%',
                      }}
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="all">All Levels</option>
                      <option value="novice">Novice</option>
                      <option value="beginner">Beginner</option>
                      <option value="advanced">Advanced</option>
                      <option value="pro">Pro</option>
                    </select>
                  </Box>
                </HStack>
                
                <VStack gap={3} w="full">
                  {teacherData.studentsByLevel.map((category, index) => (
                    <Box key={index} p={4} bg="gray.700" borderRadius="lg" w="full">
                      <HStack justify="space-between" w="full">
                        <VStack align="start" gap={1}>
                          <HStack gap={2}>
                            <Box w={3} h={3} bg={category.color} borderRadius="full" />
                            <Text fontWeight="bold" color="white" fontSize="sm">
                              {category.category} Level
                            </Text>
                          </HStack>
                          <Text fontSize="xs" color="gray.400">
                            {category.recentActivity}
                          </Text>
                        </VStack>
                        <VStack align="end" gap={1}>
                          <Text fontSize="xl" fontWeight="bold" color="white">
                            {category.count}
                          </Text>
                          <Text fontSize="xs" color="gray.400">
                            students
                          </Text>
                        </VStack>
                      </HStack>
                    </Box>
                  ))}
                </VStack>
              </VStack>
            </Box>

            {/* Recent Feedback */}
            <Box bg="gray.800" p={6} borderRadius="lg" border="1px" borderColor="gray.700">
              <VStack gap={4} align="start">
                <HStack justify="space-between" w="full">
                  <Heading size="md" color="white">
                    Recent Feedback
                  </Heading>
                  <Button size="sm" variant="ghost" color="brand.400">
                    View All
                  </Button>
                </HStack>
                
                <VStack gap={3} w="full">
                  {teacherData.recentFeedback.map((feedback, index) => (
                    <Box key={index} p={4} bg="gray.700" borderRadius="lg" w="full">
                      <VStack gap={2} align="start">
                        <HStack justify="space-between" w="full">
                          <Text fontWeight="bold" color="white" fontSize="sm">
                            {feedback.student}
                          </Text>
                          <HStack gap={1}>
                            {[...Array(feedback.rating)].map((_, i) => (
                              <Box key={i} as={FaStar} color="yellow.400" boxSize={3} />
                            ))}
                          </HStack>
                        </HStack>
                        <Text fontSize="xs" color="gray.400">
                          {feedback.course} • {feedback.date}
                        </Text>
                        <Text fontSize="sm" color="gray.300" fontStyle="italic">
                          "{feedback.comment}"
                        </Text>
                      </VStack>
                    </Box>
                  ))}
                </VStack>
                
                <Box p={4} bg="gray.700" borderRadius="lg" w="full" textAlign="center">
                  <VStack gap={2}>
                    <HStack gap={1} justify="center">
                      <Text fontSize="2xl" fontWeight="bold" color="white">4.8</Text>
                      <Box as={FaStar} color="yellow.400" boxSize={5} />
                    </HStack>
                    <Text fontSize="sm" color="gray.400">
                      Average Rating from {teacherData.totalStudents} students
                    </Text>
                  </VStack>
                </Box>
              </VStack>
            </Box>
          </Grid>
        </VStack>
      </Container>
    </Box>
  );
};

export default TeacherDashboard;