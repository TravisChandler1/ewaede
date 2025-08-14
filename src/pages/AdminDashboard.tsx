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
  Textarea,
  Input,
  Spinner,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import {
  FaUsers,
  FaChalkboardTeacher,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaSignOutAlt,
  FaEye,
  FaEnvelope,
  FaGraduationCap,
  FaChartBar,
  FaUserCog,
  FaTrash,
  FaEdit,
  FaSearch,
  FaChartLine,
  FaBook,
  FaCalendarAlt,
} from 'react-icons/fa';
import { useAdminData } from '../hooks/useAdminData';
import type { PendingTeacher as PendingTeacherType } from '../hooks/useAdminData';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { adminData, loading, approveTeacher, rejectTeacher, deleteUser } = useAdminData();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<PendingTeacherType | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [activeTab, setActiveTab] = useState(0);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const handleLogout = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <Box bg="gray.900" minH="100vh" color="white" display="flex" alignItems="center" justifyContent="center">
        <VStack gap={4}>
          <Spinner size="xl" color="brand.500" />
          <Text>Loading admin dashboard...</Text>
        </VStack>
      </Box>
    );
  }

  if (!adminData) {
    return (
      <Box bg="gray.900" minH="100vh" color="white" display="flex" alignItems="center" justifyContent="center">
        <Text>Error loading admin data</Text>
      </Box>
    );
  }

  const filteredUsers = adminData.allUsers.filter(user => {
    const matchesSearch = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const stats = [
    {
      icon: FaClock,
      title: 'Pending Applications',
      value: adminData.stats.pendingApplications.toString(),
      color: 'orange.400',
    },
    {
      icon: FaCheckCircle,
      title: 'Approved This Month',
      value: adminData.stats.approvedThisMonth.toString(),
      color: 'green.400',
    },
    {
      icon: FaTimesCircle,
      title: 'Rejected This Month',
      value: adminData.stats.rejectedThisMonth.toString(),
      color: 'red.400',
    },
    {
      icon: FaChalkboardTeacher,
      title: 'Active Teachers',
      value: adminData.stats.activeTeachers.toString(),
      color: 'blue.400',
    },
  ];

  const analyticsData = [
    {
      icon: FaUsers,
      title: 'Total Users',
      value: adminData.stats.totalUsers.toString(),
      change: '+12%',
      color: 'blue.400',
    },
    {
      icon: FaBook,
      title: 'Active Sessions',
      value: adminData.stats.activeSessions.toString(),
      change: '+8%',
      color: 'green.400',
    },
    {
      icon: FaChartLine,
      title: 'Completion Rate',
      value: `${adminData.stats.completionRate}%`,
      change: '+5%',
      color: 'purple.400',
    },
    {
      icon: FaCalendarAlt,
      title: 'Monthly Revenue',
      value: `$${adminData.stats.monthlyRevenue.toLocaleString()}`,
      change: '+15%',
      color: 'orange.400',
    },
  ];

  const handleViewDetails = (teacher: PendingTeacherType) => {
    setSelectedTeacher(teacher);
    onOpen();
  };

  const handleApprove = (teacherId: string) => {
    approveTeacher(teacherId);
    alert('Teacher approved successfully!');
    onClose();
  };

  const handleReject = (teacherId: string) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    rejectTeacher(teacherId, rejectionReason);
    alert('Teacher application rejected');
    setRejectionReason('');
    onClose();
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(userId);
      alert('User deleted successfully');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

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
                bg="red.500"
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
                color="white"
                fontWeight="bold"
              >
                AD
              </Box>
              <VStack align="start" gap={0}>
                <Heading size="md" color="white">
                  Admin Dashboard
                </Heading>
                <Text fontSize="sm" color="gray.400">
                  Manage teacher applications and system oversight
                </Text>
              </VStack>
            </HStack>
            <HStack gap={4}>
              <Badge colorScheme="red" px={3} py={1} borderRadius="full">
                Administrator
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
        <VStack gap={6} align="stretch">
          {/* Tab Navigation */}
          <HStack gap={4} justify="center">
            <Button
              variant={activeTab === 0 ? "solid" : "outline"}
              bg={activeTab === 0 ? "brand.500" : "transparent"}
              color={activeTab === 0 ? "white" : "gray.400"}
              borderColor="brand.500"
              _hover={{ bg: activeTab === 0 ? "brand.600" : "brand.500", color: "white" }}
              onClick={() => setActiveTab(0)}
            >
              <HStack gap={2}>
                <Box as={FaClock} />
                <Text>Teacher Applications</Text>
              </HStack>
            </Button>
            <Button
              variant={activeTab === 1 ? "solid" : "outline"}
              bg={activeTab === 1 ? "brand.500" : "transparent"}
              color={activeTab === 1 ? "white" : "gray.400"}
              borderColor="brand.500"
              _hover={{ bg: activeTab === 1 ? "brand.600" : "brand.500", color: "white" }}
              onClick={() => setActiveTab(1)}
            >
              <HStack gap={2}>
                <Box as={FaUserCog} />
                <Text>User Management</Text>
              </HStack>
            </Button>
            <Button
              variant={activeTab === 2 ? "solid" : "outline"}
              bg={activeTab === 2 ? "brand.500" : "transparent"}
              color={activeTab === 2 ? "white" : "gray.400"}
              borderColor="brand.500"
              _hover={{ bg: activeTab === 2 ? "brand.600" : "brand.500", color: "white" }}
              onClick={() => setActiveTab(2)}
            >
              <HStack gap={2}>
                <Box as={FaChartBar} />
                <Text>Analytics</Text>
              </HStack>
            </Button>
          </HStack>

          {/* Tab Content */}
          {activeTab === 0 && (
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
                        </VStack>
                      </VStack>
                    </Box>
                  ))}
                </Grid>

                {/* Pending Teacher Applications */}
                <Box bg="gray.800" p={6} borderRadius="lg" border="1px" borderColor="gray.700">
                  <VStack gap={4} align="start">
                    <Heading size="md" color="white">
                      Pending Teacher Applications
                    </Heading>
                    
                    {adminData.pendingTeachers.length === 0 ? (
                      <Box p={8} textAlign="center" w="full">
                        <Text color="gray.400">No pending applications</Text>
                      </Box>
                    ) : (
                      <VStack gap={4} w="full">
                        {adminData.pendingTeachers.map((teacher) => (
                          <Box key={teacher.id} p={4} bg="gray.700" borderRadius="lg" w="full">
                            <Flex justify="space-between" align="start">
                              <HStack gap={4} flex={1}>
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
                                  fontSize="sm"
                                >
                                  {teacher.firstName[0]}{teacher.lastName[0]}
                                </Box>
                                <VStack align="start" gap={1} flex={1}>
                                  <Text fontWeight="bold" color="white">
                                    {teacher.firstName} {teacher.lastName}
                                  </Text>
                                  <HStack gap={2}>
                                    <Box as={FaEnvelope} color="gray.400" boxSize={3} />
                                    <Text fontSize="sm" color="gray.400">
                                      {teacher.email}
                                    </Text>
                                  </HStack>
                                  <Text fontSize="xs" color="gray.500">
                                    Applied on {formatDate(teacher.createdAt)}
                                  </Text>
                                  {teacher.teacherProfile?.expertise && (
                                    <HStack gap={1} flexWrap="wrap">
                                      {teacher.teacherProfile.expertise.slice(0, 3).map((skill, index) => (
                                        <Badge key={index} size="sm" colorScheme="blue">
                                          {skill}
                                        </Badge>
                                      ))}
                                      {teacher.teacherProfile.expertise.length > 3 && (
                                        <Badge size="sm" colorScheme="gray">
                                          +{teacher.teacherProfile.expertise.length - 3} more
                                        </Badge>
                                      )}
                                    </HStack>
                                  )}
                                </VStack>
                              </HStack>
                              <VStack gap={2}>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  borderColor="blue.500"
                                  color="blue.400"
                                  _hover={{ bg: 'blue.500', color: 'white' }}
                                  onClick={() => handleViewDetails(teacher)}
                                >
                                  <HStack gap={1}>
                                    <Box as={FaEye} boxSize={3} />
                                    <Text>Review</Text>
                                  </HStack>
                                </Button>
                              </VStack>
                            </Flex>
                          </Box>
                        ))}
                      </VStack>
                    )}
                  </VStack>
                </Box>
              </VStack>
          )}

          {activeTab === 1 && (
              <VStack gap={6} align="stretch">
                {/* Search and Filters */}
                <Box bg="gray.800" p={6} borderRadius="lg" border="1px" borderColor="gray.700">
                  <VStack gap={4} align="start">
                    <Heading size="md" color="white">
                      User Management
                    </Heading>
                    <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4} w="full">
                      <Box>
                        <Text color="gray.300" mb={2} fontSize="sm">Search Users</Text>
                        <Input
                          placeholder="Search by name or email..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          bg="gray.700"
                          border="1px"
                          borderColor="gray.600"
                          _focus={{ borderColor: 'brand.500' }}
                        />
                      </Box>
                      <Box>
                        <Text color="gray.300" mb={2} fontSize="sm">Filter by Role</Text>
                        <select
                          value={roleFilter}
                          onChange={(e) => setRoleFilter(e.target.value)}
                          style={{
                            backgroundColor: '#2D3748',
                            border: '1px solid #4A5568',
                            borderRadius: '6px',
                            padding: '8px',
                            color: 'white',
                            width: '100%',
                          }}
                        >
                          <option value="ALL">All Roles</option>
                          <option value="STUDENT">Students</option>
                          <option value="TEACHER">Teachers</option>
                        </select>
                      </Box>
                      <Box>
                        <Text color="gray.300" mb={2} fontSize="sm">Filter by Status</Text>
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          style={{
                            backgroundColor: '#2D3748',
                            border: '1px solid #4A5568',
                            borderRadius: '6px',
                            padding: '8px',
                            color: 'white',
                            width: '100%',
                          }}
                        >
                          <option value="ALL">All Status</option>
                          <option value="ACTIVE">Active</option>
                          <option value="APPROVED">Approved</option>
                          <option value="PENDING">Pending</option>
                        </select>
                      </Box>
                    </Grid>
                  </VStack>
                </Box>

                {/* Users List */}
                <Box bg="gray.800" p={6} borderRadius="lg" border="1px" borderColor="gray.700">
                  <VStack gap={4} w="full">
                    {filteredUsers.map((user) => (
                      <Box key={user.id} p={4} bg="gray.700" borderRadius="lg" w="full">
                        <Flex justify="space-between" align="center">
                          <HStack gap={4} flex={1}>
                            <Box
                              w={10}
                              h={10}
                              bg="brand.500"
                              borderRadius="full"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              color="white"
                              fontWeight="bold"
                              fontSize="sm"
                            >
                              {user.firstName[0]}{user.lastName[0]}
                            </Box>
                            <VStack align="start" gap={1} flex={1}>
                              <HStack gap={2}>
                                <Text fontWeight="bold" color="white">
                                  {user.firstName} {user.lastName}
                                </Text>
                                <Badge colorScheme={user.role === 'TEACHER' ? 'purple' : 'blue'} size="sm">
                                  {user.role}
                                </Badge>
                                <Badge colorScheme={user.status === 'ACTIVE' || user.status === 'APPROVED' ? 'green' : 'orange'} size="sm">
                                  {user.status}
                                </Badge>
                              </HStack>
                              <Text fontSize="sm" color="gray.400">
                                {user.email}
                              </Text>
                              <Text fontSize="xs" color="gray.500">
                                Joined: {user.joinedAt} • Last active: {user.lastActive}
                              </Text>
                            </VStack>
                          </HStack>
                          <HStack gap={2}>
                            <Button size="sm" variant="outline" borderColor="blue.500" color="blue.400">
                              <Box as={FaEdit} boxSize={3} />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              borderColor="red.500"
                              color="red.400"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Box as={FaTrash} boxSize={3} />
                            </Button>
                          </HStack>
                        </Flex>
                      </Box>
                    ))}
                  </VStack>
                </Box>
              </VStack>
          )}

          {activeTab === 2 && (
              <VStack gap={6} align="stretch">
                {/* Analytics Stats */}
                <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6}>
                  {analyticsData.map((stat, index) => (
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
                            {stat.change} from last month
                          </Text>
                        </VStack>
                      </VStack>
                    </Box>
                  ))}
                </Grid>

                {/* Monthly Growth Chart */}
                <Box bg="gray.800" p={6} borderRadius="lg" border="1px" borderColor="gray.700">
                  <VStack gap={4} align="start">
                    <Heading size="md" color="white">
                      Monthly Growth Trends
                    </Heading>
                    <Grid templateColumns={{ base: '1fr', lg: 'repeat(3, 1fr)' }} gap={6} w="full">
                      {/* Students Growth */}
                      <Box p={4} bg="gray.700" borderRadius="lg">
                        <VStack gap={3} align="start">
                          <HStack gap={2}>
                            <Box as={FaUsers} color="blue.400" />
                            <Text fontWeight="bold" color="white">Students</Text>
                          </HStack>
                          <VStack gap={2} w="full">
                            {adminData.monthlyData.map((data, index) => (
                              <HStack key={index} justify="space-between" w="full">
                                <Text fontSize="sm" color="gray.400">{data.month}</Text>
                                <Text fontSize="sm" color="white" fontWeight="bold">{data.students}</Text>
                              </HStack>
                            ))}
                          </VStack>
                        </VStack>
                      </Box>

                      {/* Teachers Growth */}
                      <Box p={4} bg="gray.700" borderRadius="lg">
                        <VStack gap={3} align="start">
                          <HStack gap={2}>
                            <Box as={FaChalkboardTeacher} color="purple.400" />
                            <Text fontWeight="bold" color="white">Teachers</Text>
                          </HStack>
                          <VStack gap={2} w="full">
                            {adminData.monthlyData.map((data, index) => (
                              <HStack key={index} justify="space-between" w="full">
                                <Text fontSize="sm" color="gray.400">{data.month}</Text>
                                <Text fontSize="sm" color="white" fontWeight="bold">{data.teachers}</Text>
                              </HStack>
                            ))}
                          </VStack>
                        </VStack>
                      </Box>

                      {/* Revenue Growth */}
                      <Box p={4} bg="gray.700" borderRadius="lg">
                        <VStack gap={3} align="start">
                          <HStack gap={2}>
                            <Box as={FaChartLine} color="green.400" />
                            <Text fontWeight="bold" color="white">Revenue</Text>
                          </HStack>
                          <VStack gap={2} w="full">
                            {adminData.monthlyData.map((data, index) => (
                              <HStack key={index} justify="space-between" w="full">
                                <Text fontSize="sm" color="gray.400">{data.month}</Text>
                                <Text fontSize="sm" color="white" fontWeight="bold">${data.revenue}</Text>
                              </HStack>
                            ))}
                          </VStack>
                        </VStack>
                      </Box>
                    </Grid>
                  </VStack>
                </Box>
              </VStack>
          )}
        </VStack>
      </Container>

      {/* Teacher Details Modal */}
      {isOpen && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="blackAlpha.600"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex={1000}
          onClick={onClose}
        >
          <Box
            bg="gray.800"
            color="white"
            borderRadius="lg"
            p={6}
            maxW="2xl"
            w="90%"
            maxH="80vh"
            overflowY="auto"
            onClick={(e) => e.stopPropagation()}
          >
            <HStack justify="space-between" mb={4}>
              <Heading size="md">Teacher Application Review</Heading>
              <Button size="sm" variant="ghost" onClick={onClose}>
                ×
              </Button>
            </HStack>
            {selectedTeacher && (
              <VStack gap={4} align="start">
                <HStack gap={4}>
                  <Box
                    w={16}
                    h={16}
                    bg="brand.500"
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    color="white"
                    fontWeight="bold"
                    fontSize="lg"
                  >
                    {selectedTeacher.firstName[0]}{selectedTeacher.lastName[0]}
                  </Box>
                  <VStack align="start" gap={1}>
                    <Text fontSize="xl" fontWeight="bold">
                      {selectedTeacher.firstName} {selectedTeacher.lastName}
                    </Text>
                    <Text color="gray.400">{selectedTeacher.email}</Text>
                    <Text fontSize="sm" color="gray.500">
                      Applied on {formatDate(selectedTeacher.createdAt)}
                    </Text>
                  </VStack>
                </HStack>

                {selectedTeacher.teacherProfile && (
                  <>
                    <Box w="full">
                      <Text fontWeight="bold" mb={2}>Bio</Text>
                      <Text color="gray.300" fontSize="sm">
                        {selectedTeacher.teacherProfile.bio || 'No bio provided'}
                      </Text>
                    </Box>

                    <Box w="full">
                      <Text fontWeight="bold" mb={2}>Areas of Expertise</Text>
                      <HStack gap={2} flexWrap="wrap">
                        {selectedTeacher.teacherProfile.expertise.map((skill, index) => (
                          <Badge key={index} colorScheme="blue">
                            {skill}
                          </Badge>
                        ))}
                      </HStack>
                    </Box>

                    {selectedTeacher.teacherProfile.experience && (
                      <Box w="full">
                        <Text fontWeight="bold" mb={2}>Teaching Experience</Text>
                        <Text color="gray.300">
                          {selectedTeacher.teacherProfile.experience} years
                        </Text>
                      </Box>
                    )}
                  </>
                )}

                <Box w="full">
                  <Text fontWeight="bold" mb={2}>Rejection Reason (if rejecting)</Text>
                  <Textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Provide a reason for rejection..."
                    bg="gray.700"
                    border="1px"
                    borderColor="gray.600"
                    _focus={{ borderColor: 'brand.500' }}
                  />
                </Box>
              </VStack>
            )}
            <HStack gap={3} mt={6} justify="end">
              <Button
                bg="red.500"
                color="white"
                _hover={{ bg: 'red.600' }}
                onClick={() => selectedTeacher && handleReject(selectedTeacher.id)}
              >
                <HStack gap={2}>
                  <Box as={FaTimesCircle} />
                  <Text>Reject</Text>
                </HStack>
              </Button>
              <Button
                bg="green.500"
                color="white"
                _hover={{ bg: 'green.600' }}
                onClick={() => selectedTeacher && handleApprove(selectedTeacher.id)}
              >
                <HStack gap={2}>
                  <Box as={FaCheckCircle} />
                  <Text>Approve</Text>
                </HStack>
              </Button>
            </HStack>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default AdminDashboard;