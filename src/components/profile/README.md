# Profile Management System

A comprehensive profile management system with Facebook-style avatar dropdown and user profile management.

## 🎯 Features

### ✅ Enhanced Header with Avatar
- **Facebook-style avatar dropdown** in the header
- **Fallback avatar** with user initials when no image is set  
- **Role badges** showing user role (Admin, Staff, Member, Guest)
- **Gradient avatar** with personalized colors based on user name
- **Professional dropdown menu** with navigation options

### ✅ Comprehensive Profile Page
- **Modern card-based design** with edit/view modes
- **Avatar upload** with validation (file size, type)
- **Profile fields**: Name, phone, address, bio, date of birth, gender
- **Real-time preview** of avatar changes
- **Role-based protection** - only members and above can access

### ✅ Settings Page
- **Account information** display
- **Notification preferences** (Email, SMS, Marketing)
- **Security settings** (Two-factor authentication)  
- **Password change** functionality
- **Language and timezone** preferences

### ✅ Reusable Avatar Component
- **Multiple variants**: Basic, with status, avatar groups
- **Automatic fallback** with user initials
- **Gradient backgrounds** based on user name
- **Customizable sizes** and styling

## 📁 File Structure

```
src/
├── components/
│   ├── auth/                     # Role-based protection
│   │   ├── RoleProtection.jsx
│   │   ├── RouteProtection.jsx
│   │   └── index.js
│   └── ui/
│       ├── avatar.jsx            # Reusable avatar component
│       └── switch.jsx            # Toggle switch component
├── sections/
│   └── header/
│       └── Header.jsx            # Enhanced header with avatar
├── app/
│   └── (home)/
│       ├── profile/
│       │   └── page.js           # Profile management page
│       └── settings/
│           └── page.js           # User settings page
└── context/
    └── user_context.js          # Enhanced with role management
```

## 🔧 Usage Examples

### Header Avatar (Automatic)
The header automatically shows the user avatar with role badge:

```jsx
// Already implemented in Header.jsx
<Avatar
  src={account?.avatar || profile?.avatar}
  name={profile?.name}
  email={account?.email}
  size={40}
  className="hover:ring-2 hover:ring-blue-200"
/>
```

### Standalone Avatar Component
```jsx
import Avatar, { AvatarWithStatus, AvatarGroup } from '@/components/ui/avatar';

// Basic avatar
<Avatar
  src="/user-avatar.jpg"
  name="John Doe"
  email="john@example.com"
  size={48}
/>

// Avatar with online status
<AvatarWithStatus
  src="/user-avatar.jpg"
  name="John Doe"
  status="online"
  size={48}
/>

// Group of avatars
<AvatarGroup
  users={[
    { id: 1, name: "John", avatar: "/john.jpg" },
    { id: 2, name: "Jane", avatar: "/jane.jpg" },
    { id: 3, name: "Bob", avatar: "/bob.jpg" }
  ]}
  max={3}
  size={32}
/>
```

### Profile Page Protection
```jsx
import { RoleProtection, ROLES } from '@/components/auth';

<RoleProtection requiredRole={ROLES.MEMBER}>
  <ProfileContent />
</RoleProtection>
```

## 🎨 Styling Features

### Avatar Fallbacks
- **Personalized gradients** based on user name hash
- **Initials** from name or email
- **Consistent colors** for same user across sessions

### Role Badges
- **Admin**: Purple badge with crown icon
- **Staff**: Blue badge with briefcase icon  
- **Member**: Green badge with user icon
- **Guest**: Gray badge

### Responsive Design
- **Mobile-friendly** profile forms
- **Grid layouts** that adapt to screen size
- **Touch-friendly** controls on mobile

## 🔒 Security Features

### Role-Based Access
- **Profile page**: Requires MEMBER role or higher
- **Settings page**: Requires MEMBER role or higher
- **Admin features**: Requires ADMIN role

### Input Validation
- **Avatar upload**: Max 5MB, image files only
- **Password change**: Minimum 6 characters, confirmation matching
- **Form validation**: Required fields marked with *

### Error Handling
- **Graceful fallbacks** for missing images
- **Toast notifications** for success/error states
- **Loading states** during API calls

## 🌟 User Experience

### Professional Look
- **Clean, modern design** following current UI trends
- **Consistent spacing** and typography
- **Smooth animations** and transitions

### Intuitive Navigation
- **Breadcrumb navigation** in forms
- **Clear action buttons** with descriptive text
- **Contextual help** and descriptions

### Accessibility
- **Keyboard navigation** support
- **Screen reader** friendly labels
- **High contrast** mode support
- **Focus indicators** for interactive elements

## 🔄 Integration with Backend

The system expects these API endpoints:

```javascript
// Profile management
updateProfile(profileData) // Update user profile
getProfile() // Get user profile
getAccount() // Get account info

// Avatar upload (if implementing file upload)
uploadAvatar(file) // Upload avatar image

// Settings (future implementation)
updateSettings(settings) // Save user preferences
changePassword(passwords) // Change user password
```

## 🎯 Customization Options

### Avatar Styles
```jsx
// Different sizes
<Avatar size={24} />  // Small
<Avatar size={40} />  // Default  
<Avatar size={64} />  // Large
<Avatar size={128} /> // Extra large

// Custom styling
<Avatar 
  className="ring-4 ring-blue-500 hover:scale-110" 
  showBorder={false}
/>
```

### Profile Form Fields
Easy to add/remove fields by modifying the form state:

```jsx
const [form, setForm] = useState({
  name: "",
  phone: "",
  address: "",
  bio: "",
  // Add more fields here
  website: "",
  company: "",
  linkedIn: ""
});
```

## 📱 Mobile Responsiveness

- **Stacked layout** on mobile devices
- **Touch-friendly** button sizes
- **Optimized spacing** for small screens
- **Swipe gestures** support where applicable

This profile management system provides a complete, professional solution for user profile management with modern UX patterns and robust role-based security!
