// app/admin/users/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Table from '../../../components/Table';
import Button from '../../../components/Button';
import Spinner from '../../../components/Spinner';
import { User } from '@prisma/client';

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { data: session, status } = useSession();
  const user = session?.user as User;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/admin/users');

        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          console.error('Error fetching users:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUsers(users.filter((user) => user.id !== userId));
      } else {
        console.error('Error deleting user:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  if (user?.role !== 'ADMIN') {
    router.push('/');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-8 text-gray-800 dark:text-white">User Management</h1>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Spinner size="large" />
        </div>
      ) : (
        <Table
          columns={[
            { header: 'Username', accessor: 'username' },
            { header: 'Email', accessor: 'email' },
            { header: 'Role', accessor: 'role' },
            {
              header: 'Actions',
              accessor: 'id',
              cell: (value: string) => (
                <Button variant="danger" onClick={() => handleDeleteUser(value)}>
                  Delete
                </Button>
              ),
            } as any,
          ]}
          data={users}
        />
      )}
    </div>
  );
};

export default UserManagementPage;