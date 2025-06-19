# Role-Based Access Control (RBAC) System

This system provides comprehensive role-based protection for your React application with four distinct roles: **Guest**, **Member**, **Staff**, and **Admin**.

## Roles Hierarchy

1. **Guest** (Level 0) - Not logged in users
2. **Member** (Level 1) - Basic authenticated users
3. **Staff** (Level 2) - Moderators/Staff members
4. **Admin** (Level 3) - System administrators

## Quick Start

### 1. Wrap your app with UserProvider

```jsx
import UserProvider from '@/context/user_context';

function App() {
  return (
    <UserProvider>
      {/* Your app components */}
    </UserProvider>
  );
}
```

### 2. Protect components with RoleProtection

```jsx
import { RoleProtection, ROLES } from '@/components/auth';

function MyComponent() {
  return (
    <RoleProtection requiredRole={ROLES.MEMBER}>
      <div>This content is only visible to Members, Staff, and Admins</div>
    </RoleProtection>
  );
}
```

### 3. Protect routes with RouteProtection

```jsx
import { RouteProtection, ROLES } from '@/components/auth';

function AdminPage() {
  return (
    <RouteProtection requiredRole={ROLES.ADMIN}>
      <div>Admin Dashboard</div>
    </RouteProtection>
  );
}
```

## Components

### RoleProtection
Protects content based on user roles.

```jsx
import { RoleProtection, ROLES } from '@/components/auth';

// Basic usage
<RoleProtection requiredRole={ROLES.STAFF}>
  <AdminPanel />
</RoleProtection>

// Multiple roles (OR logic)
<RoleProtection requiredRole={[ROLES.STAFF, ROLES.ADMIN]}>
  <ModeratorTools />
</RoleProtection>

// Multiple roles (AND logic)
<RoleProtection requiredRole={[ROLES.STAFF, ROLES.ADMIN]} requireAll={true}>
  <SuperAdminTools />
</RoleProtection>

// Custom fallback
<RoleProtection 
  requiredRole={ROLES.MEMBER}
  fallback={<div>Please log in to view this content</div>}
>
  <UserContent />
</RoleProtection>

// Hide completely if no access
<RoleProtection requiredRole={ROLES.ADMIN} hideOnNoAccess={true}>
  <DeleteButton />
</RoleProtection>
```

### ShowForRoles / HideForRoles
Conditional rendering based on roles.

```jsx
import { ShowForRoles, HideForRoles, ROLES } from '@/components/auth';

// Show only for specific roles
<ShowForRoles roles={[ROLES.ADMIN]}>
  <AdminButton />
</ShowForRoles>

// Hide for specific roles
<HideForRoles roles={[ROLES.GUEST]}>
  <UserMenu />
</HideForRoles>
```

### RouteProtection
Protects entire pages/routes.

```jsx
import { RouteProtection, AdminRoute, StaffRoute, MemberRoute } from '@/components/auth';

// Basic route protection
<RouteProtection requiredRole={ROLES.MEMBER}>
  <Dashboard />
</RouteProtection>

// Predefined route components
<AdminRoute>
  <AdminPanel />
</AdminRoute>

<StaffRoute>
  <StaffDashboard />
</StaffRoute>

<MemberRoute>
  <UserProfile />
</MemberRoute>
```

## Hooks

### useRoleAccess
Comprehensive hook for role-based logic.

```jsx
import { useRoleAccess } from '@/hooks/useRoleAccess';

function MyComponent() {
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
    <div>
      <p>Current role: {userRole}</p>
      
      {isAdmin && <AdminTools />}
      {isStaff && <StaffTools />}
      
      {canAccess('manage_users') && <UserManagement />}
      {canCreate('posts') && <CreatePostButton />}
      {canUpdate('posts', true) && <EditPostButton />} {/* true = is owner */}
      {canDelete('posts') && <DeletePostButton />}
    </div>
  );
}
```

### useUserProfile
Direct access to user context.

```jsx
import { useUserProfile } from '@/context/user_context';

function Header() {
  const { userRole, loggedIn, account, logout } = useUserProfile();
  
  return (
    <header>
      {loggedIn ? (
        <div>
          <span>Welcome, {account.name} ({userRole})</span>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <LoginButton />
      )}
    </header>
  );
}
```

## Higher-Order Components (HOCs)

### withRoleProtection
Wrap components with role protection.

```jsx
import { withRoleProtection, ROLES } from '@/components/auth';

const ProtectedComponent = withRoleProtection(MyComponent, ROLES.STAFF);

// Usage
<ProtectedComponent />
```

### withRouteProtection
Wrap routes with protection.

```jsx
import { withRouteProtection, ROLES } from '@/components/auth';

const ProtectedRoute = withRouteProtection(MyPage, ROLES.ADMIN, {
  redirectTo: '/login',
  loadingComponent: <LoadingSpinner />
});
```

## Permission Configuration

### Feature Permissions

```jsx
// Define in your app
const PERMISSIONS = {
  // Public features
  'view_public_content': ['guest', 'member', 'staff', 'admin'],
  'register': ['guest'],
  'login': ['guest'],
  
  // Member features
  'view_profile': ['member', 'staff', 'admin'],
  'edit_profile': ['member', 'staff', 'admin'],
  'create_request': ['member', 'staff', 'admin'],
  
  // Staff features
  'manage_requests': ['staff', 'admin'],
  'view_all_users': ['staff', 'admin'],
  
  // Admin features
  'manage_users': ['admin'],
  'system_settings': ['admin']
};

// Use with canAccess
const { canAccess } = useRoleAccess();
const canManageUsers = canAccess('manage_users', PERMISSIONS);
```

### Menu Configuration

```jsx
const MENU_CONFIG = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    requiredRole: ['member', 'staff', 'admin']
  },
  {
    name: 'Users',
    path: '/users',
    requiredRole: ['staff', 'admin']
  },
  {
    name: 'Settings',
    path: '/settings',
    requiredRole: ['admin']
  }
];

// Filter accessible menu items
const { getAccessibleMenuItems } = useRoleAccess();
const accessibleMenus = getAccessibleMenuItems(MENU_CONFIG);
```

## Best Practices

1. **Always check roles on both frontend and backend**
2. **Use the most restrictive permissions by default**
3. **Implement proper error handling for unauthorized access**
4. **Test role changes thoroughly**
5. **Document role requirements for each feature**

## Examples

### Navigation Menu

```jsx
import { ShowForRoles, ROLES } from '@/components/auth';

function Navigation() {
  return (
    <nav>
      <Link href="/">Home</Link>
      
      <ShowForRoles roles={[ROLES.MEMBER, ROLES.STAFF, ROLES.ADMIN]}>
        <Link href="/dashboard">Dashboard</Link>
      </ShowForRoles>
      
      <ShowForRoles roles={[ROLES.STAFF, ROLES.ADMIN]}>
        <Link href="/manage">Manage</Link>
      </ShowForRoles>
      
      <ShowForRoles roles={[ROLES.ADMIN]}>
        <Link href="/admin">Admin</Link>
      </ShowForRoles>
    </nav>
  );
}
```

### Conditional Buttons

```jsx
import { useRoleAccess } from '@/hooks/useRoleAccess';

function PostActions({ post, isOwner }) {
  const { canUpdate, canDelete } = useRoleAccess();
  
  return (
    <div>
      {canUpdate('posts', isOwner) && (
        <button onClick={editPost}>Edit</button>
      )}
      
      {canDelete('posts', isOwner) && (
        <button onClick={deletePost}>Delete</button>
      )}
    </div>
  );
}
```

### Page Protection

```jsx
// pages/admin/users.jsx
import { AdminRoute } from '@/components/auth';

export default function AdminUsersPage() {
  return (
    <AdminRoute>
      <div>
        <h1>User Management</h1>
        {/* Admin content */}
      </div>
    </AdminRoute>
  );
}
```

This system provides flexible, secure, and easy-to-use role-based access control for your application. All components are fully typed and include comprehensive error handling.
