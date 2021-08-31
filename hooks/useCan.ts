import { useAuthContext } from "../contexts/AuthContext"
import { validateUserPermission } from "../utils/validateUserPermissions";

type UseCanParams = {
  permissions?: string[];
  roles?: string[];
}

export function useCan({ permissions, roles }: UseCanParams) {

  const { user, isAuthenticated } = useAuthContext();

  if (!isAuthenticated) {
    return false;
  }

  const userHasValidPermissions = validateUserPermission({ user, permissions, roles });

  return userHasValidPermissions;

}