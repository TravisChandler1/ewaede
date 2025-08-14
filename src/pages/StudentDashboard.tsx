import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Grid,
  Text,
  Button,
  Badge,
  Alert,
  AlertIndicator,
  createToaster,
} from '@chakra-ui/react';
import {
  FaBook,
  FaGraduationCap,
  FaChartLine,
  FaClock,
  FaBookOpen,
} from 'react-icons/fa';
import DashboardLayout from '../components/Layout/DashboardLayout';
import StatCard from '../components/UI/StatCard';
import ProgressCard from '../components/UI/ProgressCard';
import SessionCard from '../components/UI/SessionCard';
import GroupCard from '../components/UI/GroupCard';
import { useStudentData } from '../hooks/useUserData';
import { useAuth } from '../contexts/AuthContext';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { 
    studentData, 
    loading, 
    error, 
    updateProgress, 
    joinGroup, 
    leaveGroup, 
    joinSession,
    joinBookClub 
  } = useStudentData();
  const toaster = createToaster({
    placement: 'top-right',
  });
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleCompleteLesson = async () => {
    setActionLoading('lesson');
    try {
      const result = await updateProgress('sample-lesson-id');
      if (result.success) {
        toaster.create({
          title: 'Lesson Completed!',
          description: 'Your progress has been updated.',
          status: 'success',
          duration: 3000,
        });
      } else {
        toaster.create({
          title: 'Error',
          description: result.error || 'Failed to update progress',
          status: 'error',
          duration: 3000,
        });
      }
    } catch (error) {
      toaster.create({
        title: 'Error',
        description: 'An unexpected error occurred',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleJoinSession = async (sessionId: string) => {
    setActionLoading(`session-${sessionId}`);
    try {
      const result = await joinSession(sessionId);
      if (result.success) {
        toaster.create({
          title: 'Session Joined!',
          description: 'You have successfully joined the session.',
          status: 'success',
          duration: 3000,
        });
        // In a real app, you might redirect to the session or open a meeting URL
        if (result.data?.meetingUrl) {
          window.open(result.data.meetingUrl, '_blank');
        }
      } else {
        toaster.create({
          title: 'Error',
          description: result.error || 'Failed to join session',
          status: 'error',
          duration: 3000,
        });
      }
    } catch (error) {
      toaster.create({
        title: 'Error',
        description: 'An unexpected error occurred',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleJoinGroup = async (groupId: string) => {
    setActionLoading(`group-${groupId}`);
    try {
      const result = await joinGroup(groupId);
      if (result.success) {
        toaster.create({
          title: 'Group Joined!',
          description: 'You have successfully joined the group.',
          status: 'success',
          duration: 3000,
        });
      } else {
        toaster.create({
          title: 'Error',
          description: result.error || 'Failed to join group',
          status: 'error',
          duration: 3000,
        });
      }
    } catch (error) {
      toaster.create({
        title: 'Error',
        description: 'An unexpected error occurred',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleLeaveGroup = async (groupId: string) => {
    setActionLoading(`leave-${groupId}`);
    try {
      const result = await leaveGroup(groupId);
      if (result.success) {
        toaster.create({
          title: 'Group Left',
          description: 'You have successfully left the group.',
          status: 'info',
          duration: 3000,
        });
      } else {
        toaster.create({
          title: 'Error',
          description: result.error || 'Failed to leave group',
          status: 'error',
          duration: 3000,
        });
      }
    } catch (error) {
      toaster.create({
        title: 'Error',
        description: 'An unexpected error occurred',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <DashboardLayout 
        title="Loading..." 
        subtitle="Please wait while we load your dashboard"
      >
        <Box>Loading your dashboard...</Box>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout 
        title="Error" 
        subtitle="There was an issue loading your dashboard"
      >
        <Alert.Root status="error">
          <AlertIndicator />
          <Alert.Title>Error loading dashboard!</Alert.Title>
          <Alert.Description>{error}</Alert.Description>
        </Alert.Root>
      </DashboardLayout>
    );
  }

  if (!studentData) {
    return (
      <DashboardLayout 
        title="No Data" 
        subtitle="Unable to load student information"
      >
        <Alert.Root status="warning">
          <AlertIndicator />
          <Alert.Title>No student data found!</Alert.Title>
          <Alert.Description>
            Please contact support if this issue persists.
          </Alert.Description>
        </Alert.Root>
      </DashboardLayout>
    );
  }

  const stats = [
    {
      icon: FaGraduationCap,
      title: 'Current Level',
      value: studentData.learningLevel.charAt(0) + studentData.learningLevel.slice(1).toLowerCase(),
      color: 'green.400',
    },
    {
      icon: FaChartLine,
      title: 'Progress',
      value: `${studentData.progress.progressPercentage}%`,
      color: 'blue.400',
    },
    {
      icon: FaClock,
      title: 'Study Hours',
      value: `${studentData.progress.studyHours}h`,
      color: 'purple.400',
    },
    {
      icon: FaBook,
      title: 'Lessons Completed',
      value: `${studentData.progress.completedLessons}/${studentData.progress.totalLessons}`,
      color: 'orange.400',
    },
  ];

  return (
    <DashboardLayout 
      title={`Welcome back, ${studentData.firstName}!`}
      subtitle="Ẹ kú àárọ̀! Continue your Yoruba learning journey"
    >
      <VStack gap={8} align="stretch">
        {/* Stats Cards */}
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6}>
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              icon={stat.icon}
              title={stat.title}
              value={stat.value}
              color={stat.color}
            />
          ))}
        </Grid>

        {/* Current Plan */}
        {studentData.pricingPlan && (
          <Box bg="white" p={6} borderRadius="lg" border="1px" borderColor="gray.200" shadow="sm">
            <HStack justify="space-between">
              <VStack align="start" gap={1}>
                <Text fontSize="lg" fontWeight="bold" color="gray.800">
                  Current Plan: {studentData.pricingPlan.name}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  ${studentData.pricingPlan.monthlyPrice}/month
                </Text>
              </VStack>
              <Badge colorScheme="green" px={3} py={1} borderRadius="full">
                Active
              </Badge>
            </HStack>
          </Box>
        )}

        {/* Progress Section */}
        <ProgressCard
          title="Learning Progress"
          level={studentData.learningLevel}
          completedLessons={studentData.progress.completedLessons}
          totalLessons={studentData.progress.totalLessons}
          progressPercentage={studentData.progress.progressPercentage}
          description={`Ó dára púpọ̀! You're making excellent progress. Complete ${studentData.progress.totalLessons - studentData.progress.completedLessons} more lessons to advance to the next level.`}
          onContinue={handleCompleteLesson}
          buttonText={actionLoading === 'lesson' ? 'Updating...' : 'Complete Lesson'}
        />

        <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={8}>
          {/* Upcoming Sessions */}
          <Box bg="white" p={6} borderRadius="lg" border="1px" borderColor="gray.200" shadow="sm">
            <VStack gap={4} align="start">
              <HStack justify="space-between" w="full">
                <Text fontSize="lg" fontWeight="bold" color="gray.800">
                  Upcoming Sessions
                </Text>
                <Button size="sm" variant="ghost" color="brand.500">
                  View All
                </Button>
              </HStack>
              
              <VStack gap={3} w="full">
                {studentData.upcomingSessions.length > 0 ? (
                  studentData.upcomingSessions.map((session) => (
                    <SessionCard
                      key={session.id}
                      {...session}
                      onJoin={handleJoinSession}
                    />
                  ))
                ) : (
                  <Text color="gray.500" fontSize="sm">
                    No upcoming sessions. Check back later!
                  </Text>
                )}
              </VStack>
            </VStack>
          </Box>

          {/* My Groups */}
          <Box bg="white" p={6} borderRadius="lg" border="1px" borderColor="gray.200" shadow="sm">
            <VStack gap={4} align="start">
              <HStack justify="space-between" w="full">
                <Text fontSize="lg" fontWeight="bold" color="gray.800">
                  My Groups
                </Text>
                <Button size="sm" variant="ghost" color="brand.500">
                  Browse Groups
                </Button>
              </HStack>
              
              <VStack gap={3} w="full">
                {studentData.myGroups.length > 0 ? (
                  studentData.myGroups.map((group) => (
                    <GroupCard
                      key={group.id}
                      {...group}
                      isJoined={true}
                      onLeave={handleLeaveGroup}
                      onView={(groupId) => console.log('View group:', groupId)}
                    />
                  ))
                ) : (
                  <Text color="gray.500" fontSize="sm">
                    You haven't joined any groups yet.
                  </Text>
                )}
              </VStack>
              
              <Button 
                w="full" 
                variant="outline" 
                borderColor="brand.500" 
                color="brand.500" 
                _hover={{ bg: 'brand.500', color: 'white' }}
              >
                Find New Groups
              </Button>
            </VStack>
          </Box>
        </Grid>

        <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={8}>
          {/* E-Library */}
          <Box bg="white" p={6} borderRadius="lg" border="1px" borderColor="gray.200" shadow="sm">
            <VStack gap={4} align="start">
              <HStack justify="space-between" w="full">
                <Text fontSize="lg" fontWeight="bold" color="gray.800">
                  Continue Reading
                </Text>
                <Button size="sm" variant="ghost" color="brand.500">
                  Browse Library
                </Button>
              </HStack>
              
              <VStack gap={3} w="full">
                {studentData.recentBooks.length > 0 ? (
                  studentData.recentBooks.map((book) => (
                    <Box key={book.id} p={4} bg="gray.50" borderRadius="lg" w="full">
                      <VStack gap={2} align="start">
                        <HStack justify="space-between" w="full">
                          <Text fontWeight="bold" color="gray.800" fontSize="sm">
                            {book.title}
                          </Text>
                          <Badge colorScheme={book.type === 'Audio Book' ? 'purple' : 'blue'} size="sm">
                            {book.type}
                          </Badge>
                        </HStack>
                        <Text fontSize="xs" color="gray.600">
                          by {book.author}
                        </Text>
                        <Button size="xs" bg="brand.500" color="white" _hover={{ bg: 'brand.600' }}>
                          <HStack gap={1}>
                            <FaBookOpen size={12} />
                            <Text>Continue Reading</Text>
                          </HStack>
                        </Button>
                      </VStack>
                    </Box>
                  ))
                ) : (
                  <Text color="gray.500" fontSize="sm">
                    No recent books. Start exploring our library!
                  </Text>
                )}
              </VStack>
            </VStack>
          </Box>

          {/* Book Club */}
          <Box bg="white" p={6} borderRadius="lg" border="1px" borderColor="gray.200" shadow="sm">
            <VStack gap={4} align="start">
              <HStack justify="space-between" w="full">
                <Text fontSize="lg" fontWeight="bold" color="gray.800">
                  Book Clubs
                </Text>
                <Button size="sm" variant="ghost" color="brand.500">
                  View All
                </Button>
              </HStack>
              
              <VStack gap={3} w="full">
                {studentData.bookClubs.length > 0 ? (
                  studentData.bookClubs.map((club) => (
                    <Box key={club.id} p={4} bg="gray.50" borderRadius="lg" w="full">
                      <VStack gap={3} align="start">
                        <Text fontWeight="bold" color="gray.800">
                          {club.name}
                        </Text>
                        {club.description && (
                          <Text fontSize="sm" color="gray.600">
                            {club.description}
                          </Text>
                        )}
                        <HStack gap={4} w="full">
                          <VStack gap={1} align="start">
                            <Text fontSize="xs" color="gray.500">Members</Text>
                            <Text fontSize="sm" color="gray.800" fontWeight="bold">{club.members}</Text>
                          </VStack>
                        </HStack>
                        <Button size="sm" bg="brand.500" color="white" _hover={{ bg: 'brand.600' }} w="full">
                          Join Discussion
                        </Button>
                      </VStack>
                    </Box>
                  ))
                ) : (
                  <Text color="gray.500" fontSize="sm">
                    No book clubs joined yet. Explore available clubs!
                  </Text>
                )}
              </VStack>
              
              <Button 
                w="full" 
                variant="outline" 
                borderColor="brand.500" 
                color="brand.500" 
                _hover={{ bg: 'brand.500', color: 'white' }}
              >
                Browse Book Clubs
              </Button>
            </VStack>
          </Box>
        </Grid>
      </VStack>
    </DashboardLayout>
  );
};

export default StudentDashboard;