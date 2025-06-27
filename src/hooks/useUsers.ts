import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { User, CreateUserDto, UpdateUserDto } from "../api/users";
import { getUsers, getUser, createUser, updateUser } from "../api/users";

// Query hooks
export const useGetUsers = (enabled = true) => {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => getUsers(),
    enabled,
  });
};

export const useGetUser = (id: string, enabled = true) => {
  return useQuery<User>({
    queryKey: ["user", id],
    queryFn: () => getUser(id),
    enabled: enabled && !!id,
  });
};

// Mutation hooks
export function useCreateUser(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateUserDto) => createUser(payload),
    onSuccess: () => {
      // Invalidate users list to refetch
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onSuccessCallback?.();
      // Note: In a real app, you'd use toast here
      console.log("User created successfully");
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to create user.";
      // Note: In a real app, you'd use toast here
      console.error(errorMessage);
    },
  });
}

export function useUpdateUser(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateUserDto) => updateUser(payload),
    onSuccess: (updatedUser) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", updatedUser.id] });
      onSuccessCallback?.();
      // Note: In a real app, you'd use toast here
      console.log("User updated successfully");
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to update user.";
      // Note: In a real app, you'd use toast here
      console.error(errorMessage);
    },
  });
}
