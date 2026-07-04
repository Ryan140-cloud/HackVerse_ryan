// Role hierarchy + helpers used by server & client code.
// Keep this framework-agnostic so it can be reused in middleware, RSC, etc.

export const ROLES = ['USER', 'ORGANIZER', 'ADMIN'];

export const ROLE_LEVEL = {
  USER: 1,
  ORGANIZER: 2,
  ADMIN: 3,
};

// Permissions matrix. Rendered by /admin/roles.
export const PERMISSIONS = [
  { key: 'browse:public', label: 'Browse public content', USER: true, ORGANIZER: true, ADMIN: true },
  { key: 'bookmark:hackathon', label: 'Bookmark hackathons', USER: true, ORGANIZER: true, ADMIN: true },
  { key: 'submit:hackathon', label: 'Submit new hackathon', USER: false, ORGANIZER: true, ADMIN: true },
  { key: 'manage:own-hackathon', label: 'Manage own hackathons', USER: false, ORGANIZER: true, ADMIN: true },
  { key: 'moderate:hackathon', label: 'Approve / reject hackathons', USER: false, ORGANIZER: false, ADMIN: true },
  { key: 'manage:users', label: 'Manage users', USER: false, ORGANIZER: false, ADMIN: true },
  { key: 'manage:categories', label: 'Manage categories', USER: false, ORGANIZER: false, ADMIN: true },
  { key: 'manage:organizers', label: 'Manage organizers', USER: false, ORGANIZER: false, ADMIN: true },
  { key: 'view:analytics', label: 'View analytics', USER: false, ORGANIZER: true, ADMIN: true },
  { key: 'view:audit-logs', label: 'View audit logs', USER: false, ORGANIZER: false, ADMIN: true },
];

export function hasRole(userRole, minRole) {
  return (ROLE_LEVEL[userRole] || 0) >= (ROLE_LEVEL[minRole] || 0);
}

export function can(userRole, permissionKey) {
  const p = PERMISSIONS.find((x) => x.key === permissionKey);
  if (!p) return false;
  return !!p[userRole];
}
