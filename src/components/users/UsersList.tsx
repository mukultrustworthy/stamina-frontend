import { UserCard } from "./UserCard";

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface UsersListProps {
  users: User[] | undefined;
}

export function UsersList({ users }: UsersListProps) {
  if (!users || users.length === 0) {
    return <p className="text-gray-500">No users found</p>;
  }

  return (
    <div className="grid gap-4">
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}
