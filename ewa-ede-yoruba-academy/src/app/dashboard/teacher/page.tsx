import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function TeacherDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  if (session.user.role !== 'TEACHER') {
    redirect('/dashboard');
  }

  // Mock data - replace with actual data from your database
  const stats = [
    { name: 'Total Students', value: '42', change: '+5', changeType: 'positive' },
    { name: 'Active Courses', value: '6', change: '+1', changeType: 'positive' },
    { name: 'Upcoming Sessions', value: '3', change: '0', changeType: 'neutral' },
    { name: 'Pending Assignments', value: '12', change: '-3', changeType: 'negative' },
  ];

  const upcomingSessions = [
    {
      id: 1,
      title: 'Yoruba Conversation - Beginners',
      date: 'Today',
      time: '3:00 PM - 4:00 PM',
      students: 8,
    },
    {
      id: 2,
      title: 'Intermediate Grammar',
      date: 'Tomorrow',
      time: '10:00 AM - 11:30 AM',
      students: 6,
    },
    {
      id: 3,
      title: 'Book Club Discussion',
      date: 'Friday',
      time: '5:00 PM - 6:30 PM',
      students: 12,
    },
  ];

  const recentStudents = [
    { id: 1, name: 'Adeola Johnson', email: 'adeola@example.com', joined: '2 days ago' },
    { id: 2, name: 'Chidi Okonkwo', email: 'chidi@example.com', joined: '3 days ago' },
    { id: 3, name: 'Folake Adebayo', email: 'folake@example.com', joined: '5 days ago' },
    { id: 4, name: 'Ibrahim Musa', email: 'ibrahim@example.com', joined: '1 week ago' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome, {session.user.name?.split(' ')[0] || 'Teacher'}!</h1>
        <p className="text-muted-foreground">
          Here's an overview of your teaching activities.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.name}
              </CardTitle>
              <div className="h-4 w-4 text-muted-foreground">
                {stat.changeType === 'positive' ? (
                  <span className="text-green-500">↑</span>
                ) : stat.changeType === 'negative' ? (
                  <span className="text-red-500">↓</span>
                ) : null}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Upcoming Sessions */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Upcoming Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {upcomingSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{session.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {session.date} · {session.time}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {session.students} students registered
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                      Start
                    </button>
                    <button className="px-3 py-1 text-sm border rounded-md hover:bg-accent">
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Students */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentStudents.map((student) => (
                <div key={student.id} className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{student.name}</p>
                    <p className="text-sm text-muted-foreground">{student.email}</p>
                  </div>
                  <div className="ml-auto text-sm text-muted-foreground">
                    {student.joined}
                  </div>
                </div>
              ))}
              <button className="text-sm text-primary hover:underline w-full text-left">
                View all students
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Assignments */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Assignments to Grade</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              'Adeola Johnson - Yoruba Essay (Due: Yesterday)',
              'Chidi Okonkwo - Verb Conjugation Exercise (Due: Today)',
              'Folake Adebayo - Reading Comprehension (Due: Tomorrow)',
              'Ibrahim Musa - Cultural Presentation (Due: In 2 days)',
            ].map((assignment, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium">{assignment}</p>
                </div>
                <button className="text-sm text-primary hover:underline">
                  Grade
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
