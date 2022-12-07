export enum ROLES {
  USER = 'user',
  ADMIN = 'admin',
}

const allRoles: Record<ROLES, string[]> = {
  user: [],
  admin: ['getUsers', 'manageUsers'],
};

export const roles = Object.keys(allRoles);
export const roleRights = new Map(Object.entries(allRoles));
