import Image from "next/image";

import { getUserAvatarAsset } from "@/lib/constants/assets";
import { ROLES, type Role } from "@/lib/constants/roles";
import { cn } from "@/lib/utils";

type UserAvatarProps = {
  className?: string;
  name?: string | null;
  role?: Role;
  size?: number;
  userId?: string | null;
};

export function UserAvatar({
  className,
  name,
  role = ROLES.EMPLOYEE,
  size = 40,
  userId
}: UserAvatarProps) {
  const avatar = getUserAvatarAsset({
    id: userId,
    name,
    role
  });

  return (
    <span
      className={cn(
        "inline-flex shrink-0 overflow-hidden rounded-full border border-white bg-slate-100 ring-1 ring-slate-200",
        className
      )}
      style={{ height: size, width: size }}
    >
      <Image
        src={avatar.src}
        alt={avatar.alt}
        width={size}
        height={size}
        className="h-full w-full object-cover"
      />
    </span>
  );
}
