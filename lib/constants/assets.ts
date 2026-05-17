import { ROLES, type Role } from "@/lib/constants/roles";

export const BRAND_ASSETS = {
  logoFull: {
    src: "/assets/brand/aligniq-logo-full.png",
    alt: "AlignIQ logo"
  },
  logoFooter: {
    src: "/assets/brand/aligniq-logo-footer.png",
    alt: "AlignIQ logo"
  },
  logoMark: {
    src: "/assets/brand/aligniq-logo-mark.png",
    alt: "AlignIQ logo"
  }
} as const;

export const ROLE_AVATAR_ASSETS: Record<
  Role,
  {
    src: string;
    alt: string;
  }
> = {
  [ROLES.EMPLOYEE]: {
    src: "/assets/avatars/employee-avatar.png",
    alt: "Employee profile"
  },
  [ROLES.MANAGER]: {
    src: "/assets/avatars/manager-avatar.png",
    alt: "Manager profile"
  },
  [ROLES.ADMIN]: {
    src: "/assets/avatars/admin-avatar.png",
    alt: "Admin profile"
  }
};

export const USER_AVATAR_ASSETS: Record<
  string,
  {
    src: string;
    alt: string;
  }
> = {
  "demo-admin": {
    src: "/assets/people/ava-rodriguez.png",
    alt: "Ava Rodriguez profile"
  },
  "demo-manager": {
    src: "/assets/people/marcus-chen.png",
    alt: "Marcus Chen profile"
  },
  "manager-priya": {
    src: "/assets/people/priya-nair.png",
    alt: "Priya Nair profile"
  },
  "demo-employee": {
    src: "/assets/people/emma-patel.png",
    alt: "Emma Patel profile"
  },
  "employee-noah": {
    src: "/assets/people/noah-williams.png",
    alt: "Noah Williams profile"
  },
  "employee-lina": {
    src: "/assets/people/lina-gomez.png",
    alt: "Lina Gomez profile"
  },
  "employee-owen": {
    src: "/assets/people/owen-miller.png",
    alt: "Owen Miller profile"
  },
  "employee-sophia": {
    src: "/assets/people/sophia-lee.png",
    alt: "Sophia Lee profile"
  }
};

const USER_AVATAR_IDS_BY_NAME: Record<string, keyof typeof USER_AVATAR_ASSETS> = {
  "ava rodriguez": "demo-admin",
  "marcus chen": "demo-manager",
  "priya nair": "manager-priya",
  "emma patel": "demo-employee",
  "noah williams": "employee-noah",
  "lina gomez": "employee-lina",
  "owen miller": "employee-owen",
  "sophia lee": "employee-sophia"
};

export function getRoleAvatarAsset(role: Role) {
  return ROLE_AVATAR_ASSETS[role];
}

export function getUserAvatarAsset(user: {
  id?: string | null;
  name?: string | null;
  role: Role;
}) {
  if (user.id && USER_AVATAR_ASSETS[user.id]) {
    return USER_AVATAR_ASSETS[user.id];
  }

  const userIdFromName = user.name
    ? USER_AVATAR_IDS_BY_NAME[user.name.trim().toLowerCase()]
    : null;

  if (userIdFromName) {
    return USER_AVATAR_ASSETS[userIdFromName];
  }

  const roleAvatar = getRoleAvatarAsset(user.role);

  return {
    src: roleAvatar.src,
    alt: user.name ? `${user.name} profile` : roleAvatar.alt
  };
}
