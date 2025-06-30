import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { User, CreateUserDto, UpdateUserDto } from "../api/users";
import { getUsers, getUser, createUser, updateUser } from "../api/users";

// Error type for API responses
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

// Query keys
const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...userKeys.lists(), { filters }] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

// Query hooks
export const useGetUsers = (
  enabled = true,
  select?: (data: User[]) => User[]
) => {
  return useQuery<User[], Error, User[]>({
    queryKey: userKeys.lists(),
    queryFn: () => getUsers(),
    enabled,
    select,
  });
};

export const useGetUser = (
  id: string,
  enabled = true,
  select?: (data: User) => User
) => {
  return useQuery<User, Error, User>({
    queryKey: userKeys.detail(id),
    queryFn: () => getUser(id),
    enabled: enabled && !!id,
    select,
  });
};

// Mutation hooks
export function useCreateUser(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateUserDto) => createUser(payload),
    onSuccess: () => {
      // Invalidate users list to refetch
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      onSuccessCallback?.();
      toast.success("User created successfully");
    },
    onError: (error: ApiError) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create user.";
      toast.error(errorMessage);
    },
  });
}

export function useUpdateUser(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateUserDto) => updateUser(payload),
    onSuccess: (updatedUser) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(updatedUser.id),
      });
      onSuccessCallback?.();
      toast.success("User updated successfully");
    },
    onError: (error: ApiError) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update user.";
      toast.error(errorMessage);
    },
  });
}
