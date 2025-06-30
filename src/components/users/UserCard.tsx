interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface UserCardProps {
  user: User;
}

export function UserCard({ user }: UserCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="font-semibold text-lg">{user.name}</h3>
      <p className="text-gray-600">{user.email}</p>
      <p className="text-sm text-gray-500">
        Created: {new Date(user.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}
