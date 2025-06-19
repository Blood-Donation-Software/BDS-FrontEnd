'use client';

import { useUserProfile } from '@/context/user_context';
import { ROLES, ROLE_HIERARCHY } from '@/context/user_context';

/**
 * Custom hook for role-based access control
 * Provides convenient methods for checking user permissions
 */
export function useRoleAccess() {
    const { 
        userRole, 
        hasRole, 
        hasAnyRole, 
        isGuest, 
        isMember, 
        isStaff, 
        isAdmin,
        isLoading,
        loggedIn 
    } = useUserProfile();

    /**
     * Check if user can access a specific feature
     * @param {string} feature - Feature name
     * @param {Object} permissions - Permission configuration
     */
    const canAccess = (feature, permissions = {}) => {
        if (isLoading) return false;

        // Default permissions for common features
        const defaultPermissions = {
            // Public features
            'view_public_content': [ROLES.GUEST, ROLES.MEMBER, ROLES.STAFF, ROLES.ADMIN],
            'register': [ROLES.GUEST],
            'login': [ROLES.GUEST],
            
            // Member features
            'view_profile': [ROLES.MEMBER, ROLES.STAFF, ROLES.ADMIN],
            'edit_profile': [ROLES.MEMBER, ROLES.STAFF, ROLES.ADMIN],
            'create_request': [ROLES.MEMBER, ROLES.STAFF, ROLES.ADMIN],
            'view_own_requests': [ROLES.MEMBER, ROLES.STAFF, ROLES.ADMIN],
            
            // Staff features
            'manage_requests': [ROLES.STAFF, ROLES.ADMIN],
            'view_all_users': [ROLES.STAFF, ROLES.ADMIN],
            'moderate_content': [ROLES.STAFF, ROLES.ADMIN],
            
            // Admin features
            'manage_users': [ROLES.ADMIN],
            'system_settings': [ROLES.ADMIN],
            'view_analytics': [ROLES.ADMIN],
            'manage_roles': [ROLES.ADMIN],
        };

        const requiredRoles = permissions[feature] || defaultPermissions[feature];
        
        if (!requiredRoles) {
            console.warn(`No permissions defined for feature: ${feature}`);
            return false;
        }

        return hasAnyRole(requiredRoles);
    };

    /**
     * Check if user can perform CRUD operations
     */
    const canCreate = (resource, customRoles = null) => {
        const roles = customRoles || [ROLES.MEMBER, ROLES.STAFF, ROLES.ADMIN];
        return hasAnyRole(roles);
    };

    const canRead = (resource, isOwner = false, customRoles = null) => {
        if (isOwner && hasRole(ROLES.MEMBER)) return true;
        const roles = customRoles || [ROLES.STAFF, ROLES.ADMIN];
        return hasAnyRole(roles);
    };

    const canUpdate = (resource, isOwner = false, customRoles = null) => {
        if (isOwner && hasRole(ROLES.MEMBER)) return true;
        const roles = customRoles || [ROLES.STAFF, ROLES.ADMIN];
        return hasAnyRole(roles);
    };

    const canDelete = (resource, isOwner = false, customRoles = null) => {
        // Generally only staff and admin can delete, even if owner
        const roles = customRoles || [ROLES.STAFF, ROLES.ADMIN];
        return hasAnyRole(roles);
    };

    /**
     * Get user permission level (0-3)
     */
    const getPermissionLevel = () => {
        return ROLE_HIERARCHY[userRole] || 0;
    };

    /**
     * Check if user has higher or equal permission than another role
     */
    const hasHigherOrEqualPermission = (compareRole) => {
        return getPermissionLevel() >= (ROLE_HIERARCHY[compareRole] || 0);
    };

    /**
     * Get list of accessible menu items based on role
     */
    const getAccessibleMenuItems = (menuConfig) => {
        return menuConfig.filter(item => {
            if (!item.requiredRole) return true;
            return hasAnyRole(Array.isArray(item.requiredRole) ? item.requiredRole : [item.requiredRole]);
        });
    };

    /**
     * Navigation guard - check if user can access a route
     */
    const canAccessRoute = (routeConfig) => {
        if (!routeConfig.requiredRole) return true;
        return hasAnyRole(Array.isArray(routeConfig.requiredRole) ? routeConfig.requiredRole : [routeConfig.requiredRole]);
    };

    return {
        // Role state
        userRole,
        isLoading,
        loggedIn,
        
        // Role checks
        isGuest,
        isMember,
        isStaff,
        isAdmin,
        hasRole,
        hasAnyRole,
        
        // Permission utilities
        canAccess,
        canCreate,
        canRead,
        canUpdate,
        canDelete,
        getPermissionLevel,
        hasHigherOrEqualPermission,
        getAccessibleMenuItems,
        canAccessRoute,
        
        // Constants
        ROLES,
        ROLE_HIERARCHY
    };
}
