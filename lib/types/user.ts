import type { Role } from "@/lib/constants/roles";

export type Department = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type AlignIQUser = {
  id: string;
  departmentId: string | null;
  managerId: string | null;
  name: string;
  email: string;
  role: Role;
  title: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type UserWithDepartment = AlignIQUser & {
  department: Department | null;
};
