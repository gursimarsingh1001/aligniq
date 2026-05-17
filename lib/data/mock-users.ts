import { ROLES } from "@/lib/constants/roles";
import type { AlignIQUser, Department } from "@/lib/types/user";

const MOCK_TIMESTAMP = "2026-04-01T00:00:00.000Z";

export const mockDepartments: Department[] = [
  {
    id: "dept-product-engineering",
    name: "Product & Engineering",
    createdAt: MOCK_TIMESTAMP,
    updatedAt: MOCK_TIMESTAMP
  },
  {
    id: "dept-people",
    name: "People Operations",
    createdAt: MOCK_TIMESTAMP,
    updatedAt: MOCK_TIMESTAMP
  }
];

export const mockUsers: AlignIQUser[] = [
  {
    id: "demo-admin",
    departmentId: "dept-people",
    managerId: null,
    name: "Ava Rodriguez",
    email: "admin@aligniq.local",
    role: ROLES.ADMIN,
    title: "People Operations Lead",
    isActive: true,
    createdAt: MOCK_TIMESTAMP,
    updatedAt: MOCK_TIMESTAMP
  },
  {
    id: "demo-manager",
    departmentId: "dept-product-engineering",
    managerId: null,
    name: "Marcus Chen",
    email: "manager@aligniq.local",
    role: ROLES.MANAGER,
    title: "Engineering Manager",
    isActive: true,
    createdAt: MOCK_TIMESTAMP,
    updatedAt: MOCK_TIMESTAMP
  },
  {
    id: "manager-priya",
    departmentId: "dept-product-engineering",
    managerId: null,
    name: "Priya Nair",
    email: "priya.manager@aligniq.local",
    role: ROLES.MANAGER,
    title: "Product Manager",
    isActive: true,
    createdAt: MOCK_TIMESTAMP,
    updatedAt: MOCK_TIMESTAMP
  },
  {
    id: "demo-employee",
    departmentId: "dept-product-engineering",
    managerId: "demo-manager",
    name: "Emma Patel",
    email: "employee@aligniq.local",
    role: ROLES.EMPLOYEE,
    title: "Product Designer",
    isActive: true,
    createdAt: MOCK_TIMESTAMP,
    updatedAt: MOCK_TIMESTAMP
  },
  {
    id: "employee-noah",
    departmentId: "dept-product-engineering",
    managerId: "demo-manager",
    name: "Noah Williams",
    email: "noah@aligniq.local",
    role: ROLES.EMPLOYEE,
    title: "Frontend Engineer",
    isActive: true,
    createdAt: MOCK_TIMESTAMP,
    updatedAt: MOCK_TIMESTAMP
  },
  {
    id: "employee-lina",
    departmentId: "dept-product-engineering",
    managerId: "demo-manager",
    name: "Lina Gomez",
    email: "lina@aligniq.local",
    role: ROLES.EMPLOYEE,
    title: "Backend Engineer",
    isActive: true,
    createdAt: MOCK_TIMESTAMP,
    updatedAt: MOCK_TIMESTAMP
  },
  {
    id: "employee-owen",
    departmentId: "dept-product-engineering",
    managerId: "manager-priya",
    name: "Owen Miller",
    email: "owen@aligniq.local",
    role: ROLES.EMPLOYEE,
    title: "Product Analyst",
    isActive: true,
    createdAt: MOCK_TIMESTAMP,
    updatedAt: MOCK_TIMESTAMP
  },
  {
    id: "employee-sophia",
    departmentId: "dept-people",
    managerId: "manager-priya",
    name: "Sophia Lee",
    email: "sophia@aligniq.local",
    role: ROLES.EMPLOYEE,
    title: "People Partner",
    isActive: true,
    createdAt: MOCK_TIMESTAMP,
    updatedAt: MOCK_TIMESTAMP
  }
];
