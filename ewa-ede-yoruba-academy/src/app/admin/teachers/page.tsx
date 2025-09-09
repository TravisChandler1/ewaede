import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import { TeacherApprovalButton } from '@/components/admin/TeacherApprovalButton';

interface TeacherProfile {
  id: string;
  bio?: string | null;
  qualifications: string;
  experience?: number | null;
  specialization: string;
  rating?: number | null;
  totalRatings: number;
  isVerified: boolean;
  status: string;
  rejectionReason?: string | null;
  submittedAt: Date;
  reviewedAt?: Date | null;
}

interface PendingTeacher {
  id: string;
  name: string | null;
  email: string;
  createdAt: Date;
  teacherProfile: TeacherProfile | null;
}

interface ApprovedTeacher {
  id: string;
  name: string | null;
  email: string;
  createdAt: Date;
  teacherProfile: TeacherProfile | null;
  _count?: {
    createdCourses: number;
  };
}

export default async function AdminTeachersPage() {
  const session = await auth();
  
  if (session?.user.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  // Fetch pending teachers
  const pendingTeachers = await prisma.user.findMany({
    where: { 
      role: 'PENDING_TEACHER',
      teacherProfile: {
        status: 'PENDING'
      }
    },
    include: {
      teacherProfile: true
    },
    orderBy: { createdAt: 'desc' }
  });

  // Fetch approved teachers
  const approvedTeachers = await prisma.user.findMany({
    where: { 
      role: 'TEACHER',
      teacherProfile: {
        status: 'APPROVED'
      }
    },
    include: {
      teacherProfile: true,
      _count: {
        select: { createdCourses: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Teacher Management</h1>
        <p className="text-gray-600">Manage teacher applications and profiles</p>
      </div>

      {/* Pending Applications */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" />
              Pending Applications
            </CardTitle>
            <Badge variant="outline" className="bg-amber-50 text-amber-700">
              {pendingTeachers.length} pending
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {pendingTeachers.length > 0 ? (
            <div className="space-y-4">
              {pendingTeachers.map((teacher: PendingTeacher) => (
                <div 
                  key={teacher.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{teacher.name}</p>
                    <p className="text-sm text-gray-600">{teacher.email}</p>
                    {teacher.teacherProfile?.specialization && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        <Badge variant="secondary">
                          {teacher.teacherProfile.specialization}
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <TeacherApprovalButton 
                      teacherId={teacher.id} 
                      action="APPROVE"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Approve
                    </TeacherApprovalButton>
                    <TeacherApprovalButton 
                      teacherId={teacher.id} 
                      action="REJECT"
                      variant="outline"
                      className="border-red-300 text-red-700 hover:bg-red-50"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </TeacherApprovalButton>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No pending teacher applications.</p>
          )}
        </CardContent>
      </Card>

      {/* Approved Teachers */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Approved Teachers
            </CardTitle>
            <Badge variant="outline" className="bg-green-50 text-green-700">
              {approvedTeachers.length} teachers
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {approvedTeachers.length > 0 ? (
            <div className="space-y-4">
              {approvedTeachers.map((teacher: ApprovedTeacher) => (
                <div 
                  key={teacher.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{teacher.name}</p>
                    <p className="text-sm text-gray-600">{teacher.email}</p>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <span>{teacher._count?.createdCourses || 0} courses</span>
                      <span className="mx-2">•</span>
                      <span>Joined {new Date(teacher.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No approved teachers yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
