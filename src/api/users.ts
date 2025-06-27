// API types
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
}

export interface UpdateUserDto extends Partial<CreateUserDto> {
  id: string;
}

// API functions
export const getUsers = async (): Promise<User[]> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "1",
          name: "John Doe",
          email: "john@example.com",
          createdAt: "2024-01-01T00:00:00Z",
        },
        {
          id: "2",
          name: "Jane Smith",
          email: "jane@example.com",
          createdAt: "2024-01-02T00:00:00Z",
        },
      ]);
    }, 1000);
  });
};

export const getUser = async (id: string): Promise<User> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = {
        id,
        name: "John Doe",
        email: "john@example.com",
        createdAt: "2024-01-01T00:00:00Z",
      };
      resolve(user);
    }, 800);
  });
};

export const createUser = async (userData: CreateUserDto): Promise<User> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: Math.random().toString(36).substr(2, 9),
        ...userData,
        createdAt: new Date().toISOString(),
      });
    }, 600);
  });
};

export const updateUser = async (userData: UpdateUserDto): Promise<User> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: userData.id,
        name: userData.name || "Updated Name",
        email: userData.email || "updated@example.com",
        createdAt: "2024-01-01T00:00:00Z",
      });
    }, 600);
  });
};
