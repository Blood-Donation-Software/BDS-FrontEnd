'use client';

import { 
    RoleProtection, 
    ShowForRoles, 
    HideForRoles, 
    ROLES 
} from '@/components/auth';
import { useRoleAccess } from '@/hooks/useRoleAccess';

/**
 * Example component demonstrating role-based protection usage
 */
export default function RoleProtectionExample() {
    const { 
        userRole, 
        isAdmin, 
        isStaff, 
        isMember, 
        isGuest,
        canAccess,
        canCreate,
        canUpdate,
        canDelete
    } = useRoleAccess();

    return (
        <div className="p-6 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-4">Role Protection Examples</h2>
                <p className="text-gray-600 mb-4">
                    Current role: <span className="font-semibold text-blue-600">{userRole}</span>
                </p>

                {/* Basic Role Protection */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Basic Role Protection</h3>
                    
                    <RoleProtection requiredRole={ROLES.MEMBER}>
                        <div className="bg-green-50 border border-green-200 p-4 rounded">
                            ✅ This content is visible to Members, Staff, and Admins
                        </div>
                    </RoleProtection>

                    <RoleProtection requiredRole={ROLES.STAFF}>
                        <div className="bg-blue-50 border border-blue-200 p-4 rounded">
                            ✅ This content is visible to Staff and Admins only
                        </div>
                    </RoleProtection>

                    <RoleProtection requiredRole={ROLES.ADMIN}>
                        <div className="bg-purple-50 border border-purple-200 p-4 rounded">
                            ✅ This content is visible to Admins only
                        </div>
                    </RoleProtection>
                </div>

                {/* Show/Hide Components */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Show/Hide Based on Roles</h3>
                    
                    <ShowForRoles roles={[ROLES.ADMIN]}>
                        <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                            Delete All Data (Admin Only)
                        </button>
                    </ShowForRoles>

                    <ShowForRoles roles={[ROLES.STAFF, ROLES.ADMIN]}>
                        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                            Manage Users (Staff/Admin)
                        </button>
                    </ShowForRoles>

                    <HideForRoles roles={[ROLES.GUEST]}>
                        <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                            View Profile (Hidden from Guests)
                        </button>
                    </HideForRoles>
                </div>

                {/* Permission Checks */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Permission Checks</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-medium mb-2">CRUD Permissions</h4>
                            <ul className="space-y-1 text-sm">
                                <li>Can Create: {canCreate('posts') ? '✅' : '❌'}</li>
                                <li>Can Read All: {canAccess('view_all_users') ? '✅' : '❌'}</li>
                                <li>Can Update: {canUpdate('posts') ? '✅' : '❌'}</li>
                                <li>Can Delete: {canDelete('posts') ? '✅' : '❌'}</li>
                            </ul>
                        </div>
                        
                        <div>
                            <h4 className="font-medium mb-2">Feature Access</h4>
                            <ul className="space-y-1 text-sm">
                                <li>Dashboard: {canAccess('view_profile') ? '✅' : '❌'}</li>
                                <li>Analytics: {canAccess('view_analytics') ? '✅' : '❌'}</li>
                                <li>Settings: {canAccess('system_settings') ? '✅' : '❌'}</li>
                                <li>User Management: {canAccess('manage_users') ? '✅' : '❌'}</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Role Status */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Role Status</h3>
                    <div className="grid grid-cols-4 gap-4 text-center">
                        <div className={`p-3 rounded ${isGuest ? 'bg-gray-200' : 'bg-gray-50'}`}>
                            <div className={`text-lg ${isGuest ? 'text-gray-800' : 'text-gray-400'}`}>
                                {isGuest ? '👤' : '👤'}
                            </div>
                            <div className="text-sm font-medium">Guest</div>
                            <div className="text-xs">{isGuest ? 'Current' : 'Not Active'}</div>
                        </div>
                        
                        <div className={`p-3 rounded ${isMember ? 'bg-green-200' : 'bg-gray-50'}`}>
                            <div className={`text-lg ${isMember ? 'text-green-800' : 'text-gray-400'}`}>
                                👥
                            </div>
                            <div className="text-sm font-medium">Member</div>
                            <div className="text-xs">{isMember ? 'Current' : 'Not Active'}</div>
                        </div>
                        
                        <div className={`p-3 rounded ${isStaff ? 'bg-blue-200' : 'bg-gray-50'}`}>
                            <div className={`text-lg ${isStaff ? 'text-blue-800' : 'text-gray-400'}`}>
                                👨‍💼
                            </div>
                            <div className="text-sm font-medium">Staff</div>
                            <div className="text-xs">{isStaff ? 'Current' : 'Not Active'}</div>
                        </div>
                        
                        <div className={`p-3 rounded ${isAdmin ? 'bg-purple-200' : 'bg-gray-50'}`}>
                            <div className={`text-lg ${isAdmin ? 'text-purple-800' : 'text-gray-400'}`}>
                                👑
                            </div>
                            <div className="text-sm font-medium">Admin</div>
                            <div className="text-xs">{isAdmin ? 'Current' : 'Not Active'}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
