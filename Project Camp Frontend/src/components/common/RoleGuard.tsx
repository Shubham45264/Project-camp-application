import { ReactNode } from "react";

interface RoleGuardProps {
    children: ReactNode;
    allowedRoles: string[];
    currentRole: string | null;
}

export const RoleGuard = ({ children, allowedRoles, currentRole }: RoleGuardProps) => {
    if (!currentRole || !allowedRoles.includes(currentRole)) {
        return null;
    }

    return <>{children}</>;
};
