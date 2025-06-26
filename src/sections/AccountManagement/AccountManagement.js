"use client"
import { SidebarTrigger } from "@/components/ui/sidebar";
import { enableAccount, disableAccount } from "@/apis/user";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export default function AccountManagement() {
    const [accounts, setAccounts] = useState([
        { id: 1, name: 'John Smith', email: 'john.smith@example.com', role: 'Donor', status: 'Active', lastLogin: '2 hours ago' },
        { id: 2, name: 'Sarah Johnson', email: 'sarah.j@example.com', role: 'Staff', status: 'Active', lastLogin: 'Yesterday' },
        { id: 3, name: 'Mike Wilson', email: 'mike.w@example.com', role: 'Donor', status: 'Inactive', lastLogin: '3 weeks ago' },
        { id: 4, name: 'Lisa Brown', email: 'lisa.brown@example.com', role: 'Staff', status: 'Active', lastLogin: '1 day ago' },
        { id: 5, name: 'David Lee', email: 'david.lee@example.com', role: 'Admin', status: 'Active', lastLogin: '5 hours ago' },
    ]);
    const [loadingId, setLoadingId] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Donor', status: 'Active', lastLogin: 'Chưa đăng nhập' });

    const getStatusBadge = (status) => {
        const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
        if (status === 'Active') {
            return `${baseClasses} bg-green-100 text-green-800` ;
        } else if (status === 'Inactive') {
            return `${baseClasses} bg-gray-100 text-gray-800`;
        }
        return baseClasses;
    };

    const handleEnableDisable = async (account) => {
        setLoadingId(account.id);
        try {
            if (account.status === 'Active') {
                await disableAccount(account.id);
                setAccounts(prev => prev.map(a => a.id === account.id ? { ...a, status: 'Inactive' } : a));
            } else {
                await enableAccount(account.id);
                setAccounts(prev => prev.map(a => a.id === account.id ? { ...a, status: 'Active' } : a));
            }
        } catch (e) {
            alert('Có lỗi xảy ra!');
        } finally {
            setLoadingId(null); 
        }
    };

    return(
        <div className="p-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
                <div className="relative flex-1 max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        className="py-2 pl-10 pr-4 w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                        placeholder="Search accounts..."
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <select className="py-2 px-3 border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500">
                        <option value="">All Roles</option>
                        <option value="donor">Donor</option>
                        <option value="staff">Staff</option>
                        <option value="admin">Admin</option>
                    </select>

                    <select className="py-2 px-3 border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500">
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>

                    <button className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md flex items-center space-x-2 transition-colors"
                        onClick={() => setShowAddForm(true)}>
                        <span className="text-lg">+</span>
                        <span>Add User</span>
                    </button>
                </div>
            </div>
            <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
  <DialogContent className="sm:max-w-[500px]">
    <DialogHeader>
      <DialogTitle className="text-lg font-semibold">Add New User</DialogTitle>
    </DialogHeader>

    <div className="grid gap-4 py-2">
      {/* Name - Hàng 1 */}
      <div className="space-y-1">
        <label className="block text-sm text-gray-600">Name</label>
        <input
          className="w-full px-3 py-2 h-10 border rounded-md focus:ring-1 focus:ring-red-500"
          placeholder="Full name"
          value={newUser.name}
          onChange={(e) => setNewUser({...newUser, name: e.target.value})}
        />
      </div>

      {/* Email - Hàng 2 */}
      <div className="space-y-1">
        <label className="block text-sm text-gray-600">Email</label>
        <input
          className="w-full px-3 py-2 h-10 border rounded-md focus:ring-1 focus:ring-red-500"
          placeholder="user@example.com"
          value={newUser.email}
          onChange={(e) => setNewUser({...newUser, email: e.target.value})}
        />
      </div>

      {/* Role - Hàng 3 */}
      <div className="space-y-1">
        <label className="block text-sm text-gray-600">Role</label>
        <select
          className="w-full px-3 py-2 h-10 border rounded-md focus:ring-1 focus:ring-red-500"
          value={newUser.role}
          onChange={(e) => setNewUser({...newUser, role: e.target.value})}
        >
          <option value="Donor">Donor</option>
          <option value="Staff">Staff</option>
          <option value="Admin">Admin</option>
        </select>
      </div>

      {/* Status - Hàng 4 */}
      <div className="space-y-1">
        <label className="block text-sm text-gray-600">Status</label>
        <select
          className="w-full px-3 py-2 h-10 border rounded-md focus:ring-1 focus:ring-red-500"
          value={newUser.status}
          onChange={(e) => setNewUser({...newUser, status: e.target.value})}
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>
    </div>

    <DialogFooter className="mt-4">
      <button
        className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50"
        onClick={() => setShowAddForm(false)}
      >
        Cancel
      </button>
      <button
        className="px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
        onClick={() => {
          if (!newUser.name || !newUser.email) {
            alert('Vui lòng điền tên và email');
            return;
          }
          setAccounts(prev => [
            {...newUser, id: Date.now()},
            ...prev,
          ]);
          setShowAddForm(false);
          setNewUser({name: '', email: '', role: 'Donor', status: 'Active', lastLogin: 'Never'});
        }}
      >
        Save User
      </button>
    </DialogFooter>
  </DialogContent>
</Dialog>
            {/* Accounts Table */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                {/* Table Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500">
                        <div className="col-span-3">Name</div>
                        <div className="col-span-3">Email</div>
                        <div className="col-span-2">Role</div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-2">Actions</div>
                    </div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-gray-200">
                    {accounts.map((account) => (
                        <div key={account.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                            <div className="grid grid-cols-12 gap-4 items-center">
                                {/* Name */}
                                <div className="col-span-3">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                                            <span className="text-gray-600 text-xs">{account.name.split(' ').map(n => n[0]).join('')}</span>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-900">{account.name}</h3>
                                            <p className="text-xs text-gray-500">Last login: {account.lastLogin}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="col-span-3">
                                    <span className="text-sm text-gray-900">{account.email}</span>
                                </div>

                                {/* Role */}
                                <div className="col-span-2">
                                    <span className="text-sm text-gray-900">{account.role}</span>
                                </div>

                                {/* Status */}
                                <div className="col-span-2">
                                    <span className={getStatusBadge(account.status)}>
                                        {account.status}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="col-span-2 flex items-center space-x-2">
                                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                    {account.status === 'Active' ? (
                                        <button
                                            className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-xs font-medium"
                                            onClick={() => handleEnableDisable(account)}
                                            disabled={loadingId === account.id}
                                        >
                                            Disable
                                        </button>
                                    ) : (
                                        <button
                                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-xs font-medium"
                                            onClick={() => handleEnableDisable(account)}
                                            disabled={loadingId === account.id}
                                        >
                                            Enable
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}