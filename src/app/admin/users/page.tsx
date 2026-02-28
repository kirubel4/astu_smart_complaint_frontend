'use client';

import { useEffect, useState } from 'react';
import { adminService } from '@/lib/services/admin.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { User } from '@/types';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    adminService
      .getUsers()
      .then(users => setUsers(users ?? []))
      .catch(() => setUsers([]));
  }, []);
  console.log('USERS RESPONSE:', users);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2">Name</th>
                <th className="py-2">Email</th>
                <th className="py-2">Role</th>
              </tr>
            </thead>

            <tbody>   
              {users?.map(user => (
                <tr key={user.id} className="border-b">
                  <td className="py-2">{user.name}</td>
                  <td className="py-2">{user.email}</td>
                  <td className="py-2">{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {users?.length === 0 && (
            <p className="py-4 text-sm text-muted-foreground">
              No users found.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
