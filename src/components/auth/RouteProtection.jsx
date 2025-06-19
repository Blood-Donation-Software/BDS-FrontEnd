'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserProfile } from '@/context/user_context';
import { ROLES } from '@/context/user_context';

/**
 * Component to protect routes based on user roles
 * Redirects to appropriate pages if user doesn't have access
 */
export default function RouteProtection({ 
    children, 
    requiredRole, 
    redirectTo = '/login',
    requireAll = false,
    loadingComponent = null,
    unauthorizedComponent = null 
}) {
    const { userRole, hasRole, hasAnyRole, isLoading, loggedIn } = useUserProfile();
    const router = useRouter();

    useEffect(() => {
        // Don't redirect while loading
        if (isLoading) return;

        // Check if user needs to be logged in
        const needsLogin = requiredRole && requiredRole !== ROLES.GUEST;
        
        if (needsLogin && !loggedIn) {
            router.push(redirectTo);
            return;
        }

        // Check role permissions
        if (requiredRole && loggedIn) {
            let hasAccess = false;

            if (Array.isArray(requiredRole)) {
                if (requireAll) {
                    hasAccess = requiredRole.every(role => hasRole(role));
                } else {
                    hasAccess = hasAnyRole(requiredRole);
                }
            } else {
                hasAccess = hasRole(requiredRole);
            }

            if (!hasAccess) {
                // Redirect based on user role
                if (userRole === ROLES.GUEST) {
                    router.push('/login');
                } else {
                    router.push('/unauthorized');
                }
            }
        }
    }, [userRole, isLoading, loggedIn, requiredRole, requireAll, router, redirectTo, hasRole, hasAnyRole]);

    // Show loading state
    if (isLoading) {
        if (loadingComponent) {
            return loadingComponent;
        }
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // Check if user is authorized
    if (requiredRole) {
        const needsLogin = requiredRole !== ROLES.GUEST;
        
        if (needsLogin && !loggedIn) {
            return null; // Will redirect in useEffect
        }

        if (loggedIn) {
            let hasAccess = false;

            if (Array.isArray(requiredRole)) {
                if (requireAll) {
                    hasAccess = requiredRole.every(role => hasRole(role));
                } else {
                    hasAccess = hasAnyRole(requiredRole);
                }
            } else {
                hasAccess = hasRole(requiredRole);
            }

            if (!hasAccess) {
                if (unauthorizedComponent) {
                    return unauthorizedComponent;
                }
                return null; // Will redirect in useEffect
            }
        }
    }

    return children;
}

/**
 * Higher-order component for route protection
 */
export function withRouteProtection(WrappedComponent, requiredRole, options = {}) {
    return function ProtectedRoute(props) {
        return (
            <RouteProtection requiredRole={requiredRole} {...options}>
                <WrappedComponent {...props} />
            </RouteProtection>
        );
    };
}

/**
 * Component for protecting admin routes
 */
export function AdminRoute({ children, ...props }) {
    return (
        <RouteProtection requiredRole={ROLES.ADMIN} {...props}>
            {children}
        </RouteProtection>
    );
}

/**
 * Component for protecting staff routes
 */
export function StaffRoute({ children, ...props }) {
    return (
        <RouteProtection requiredRole={[ROLES.STAFF, ROLES.ADMIN]} {...props}>
            {children}
        </RouteProtection>
    );
}

/**
 * Component for protecting member routes
 */
export function MemberRoute({ children, ...props }) {
    return (
        <RouteProtection requiredRole={[ROLES.MEMBER, ROLES.STAFF, ROLES.ADMIN]} {...props}>
            {children}
        </RouteProtection>
    );
}

/**
 * Component for guest-only routes (login, register)
 */
export function GuestOnlyRoute({ children, redirectTo = '/dashboard', ...props }) {
    return (
        <RouteProtection 
            requiredRole={ROLES.GUEST} 
            redirectTo={redirectTo}
            {...props}
        >
            {children}
        </RouteProtection>
    );
}
