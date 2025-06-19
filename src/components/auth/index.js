// Role-based Access Control utilities and components
export { ROLES, ROLE_HIERARCHY } from '@/context/user_context';
export { default as RoleProtection, ShowForRoles, HideForRoles, withRoleProtection } from './RoleProtection';
export { default as RouteProtection, withRouteProtection, AdminRoute, StaffRoute, MemberRoute, GuestOnlyRoute } from './RouteProtection';
export { default as UnauthorizedPage } from './UnauthorizedPage';
export { useRoleAccess } from '@/hooks/useRoleAccess';

// Example usage configurations
export const MENU_PERMISSIONS = {
    dashboard: ['member', 'staff', 'admin'],
    users: ['staff', 'admin'],
    settings: ['admin'],
    reports: ['staff', 'admin'],
    profile: ['member', 'staff', 'admin']
};

export const FEATURE_PERMISSIONS = {
    // Public features
    view_public_content: ['guest', 'member', 'staff', 'admin'],
    register: ['guest'],
    login: ['guest'],
    
    // Member features
    view_profile: ['member', 'staff', 'admin'],
    edit_profile: ['member', 'staff', 'admin'],
    create_request: ['member', 'staff', 'admin'],
    view_own_requests: ['member', 'staff', 'admin'],
    
    // Staff features
    manage_requests: ['staff', 'admin'],
    view_all_users: ['staff', 'admin'],
    moderate_content: ['staff', 'admin'],
    
    // Admin features
    manage_users: ['admin'],
    system_settings: ['admin'],
    view_analytics: ['admin'],
    manage_roles: ['admin']
};
