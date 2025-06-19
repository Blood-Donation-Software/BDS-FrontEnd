'use client';

import { useUserProfile } from '@/context/user_context';
import { ROLES } from '@/context/user_context';

/**
 * Component to protect content based on user roles
 * @param {Object} props
 * @param {string|string[]} props.requiredRole - Required role(s) to access content
 * @param {boolean} props.requireAll - If multiple roles provided, require all (AND) vs any (OR)
 * @param {React.ReactNode} props.children - Content to protect
 * @param {React.ReactNode} props.fallback - Content to show when access denied
 * @param {boolean} props.hideOnNoAccess - Hide component entirely if no access (default: false)
 */
export default function RoleProtection({ 
    requiredRole, 
    requireAll = false,
    children, 
    fallback = null,
    hideOnNoAccess = false 
}) {
    const { userRole, hasRole, hasAnyRole, isLoading } = useUserProfile();

    // Show loading state while user data is being fetched
    if (isLoading) {
        return <div className="flex justify-center items-center p-4">Loading...</div>;
    }

    let hasAccess = false;

    if (Array.isArray(requiredRole)) {
        if (requireAll) {
            // User must have ALL required roles (AND logic)
            hasAccess = requiredRole.every(role => hasRole(role));
        } else {
            // User must have ANY of the required roles (OR logic)
            hasAccess = hasAnyRole(requiredRole);
        }
    } else {
        // Single role requirement
        hasAccess = hasRole(requiredRole);
    }

    if (!hasAccess) {
        if (hideOnNoAccess) {
            return null;
        }
        
        if (fallback) {
            return fallback;
        }

        // Default fallback message
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md">
                    <div className="text-yellow-600 mb-2">
                        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Restricted</h3>
                    <p className="text-gray-600">
                        You don't have the required permissions to access this content.
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        Current role: <span className="font-medium">{userRole}</span>
                    </p>
                </div>
            </div>
        );
    }

    return children;
}

/**
 * Component to show content only for specific roles
 */
export function ShowForRoles({ roles, children, hideOnNoAccess = true }) {
    return (
        <RoleProtection 
            requiredRole={roles} 
            hideOnNoAccess={hideOnNoAccess}
        >
            {children}
        </RoleProtection>
    );
}

/**
 * Component to hide content for specific roles
 */
export function HideForRoles({ roles, children }) {
    const { hasAnyRole, isLoading } = useUserProfile();

    if (isLoading) {
        return null;
    }

    const shouldHide = Array.isArray(roles) ? hasAnyRole(roles) : hasRole(roles);
    
    return shouldHide ? null : children;
}

/**
 * Higher-order component for role-based route protection
 */
export function withRoleProtection(WrappedComponent, requiredRole, options = {}) {
    return function ProtectedComponent(props) {
        return (
            <RoleProtection 
                requiredRole={requiredRole} 
                {...options}
            >
                <WrappedComponent {...props} />
            </RoleProtection>
        );
    };
}
