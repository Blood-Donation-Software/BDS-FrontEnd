"use client"
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { getAllAccount } from "@/apis/user";
import { updateStatus } from "@/apis/user";
import { createProfile } from "@/apis/user"; 
import { useLanguage } from "@/context/language_context";

export default function AccountManagement() {
    const {t} = useLanguage();
    const [accounts, setAccounts] = useState([
        // { id: 1, name: 'John Smith', email: 'john.smith@example.com', role: 'Donor', status: 'Active', lastLogin: '2 hours ago' },
        // { id: 2, name: 'Sarah Johnson', email: 'sarah.j@example.com', role: 'Staff', status: 'Active', lastLogin: 'Yesterday' },
        // { id: 3, name: 'Mike Wilson', email: 'mike.w@example.com', role: 'Donor', status: 'Inactive', lastLogin: '3 weeks ago' },
        // { id: 4, name: 'Lisa Brown', email: 'lisa.brown@example.com', role: 'Staff', status: 'Active', lastLogin: '1 day ago' },
        // { id: 5, name: 'David Lee', email: 'david.lee@example.com', role: 'Admin', status: 'Active', lastLogin: '5 hours ago' },
    ]);
    const [loadingId, setLoadingId] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newUser, setNewUser] = useState({
        email: '',
        password: '',
        role: 'MEMBER',
        status: 'ENABLE',
        avatar: ''
    });

    // Thêm state cho search và filter
    const [searchText, setSearchText] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    // Đặt fetchAccounts ra ngoài useEffect
    const fetchAccounts = async () => {
        try {
            const data = await getAllAccount();
            setAccounts(
                Array.isArray(data.content)
                    ? data.content.map(acc => ({
                        ...acc,
                        status: acc.status?.toUpperCase(), // chuyển về viết hoa
                        name: acc.name || acc.email,
                        lastLogin: acc.lastLogin || "Chưa đăng nhập"
                    }))
                    : []
            );
        } catch (e) {
            alert(t.accountManagement.systemMessages.cannotLoadAccounts);
            setAccounts([]);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);
    const filteredAccounts = accounts.filter(acc => {
        const matchesSearch =
            acc.name?.toLowerCase().includes(searchText.toLowerCase()) ||
            acc.email?.toLowerCase().includes(searchText.toLowerCase());
        const matchesRole = roleFilter ? acc.role === roleFilter : true;
        const matchesStatus = statusFilter ? acc.status === statusFilter : true;
        return matchesSearch && matchesRole && matchesStatus;
    });
    const getStatusBadge = (Status) => {
        const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
        if (Status === 'ENABLE') {
            return `${baseClasses} bg-green-100 text-green-800`;
        } else if (Status === 'DISABLE') {
            return `${baseClasses} bg-gray-100 text-gray-800`;
        }
        return baseClasses;
    };

const handleStatus = async (account) => {
    setLoadingId(account.id);
    try {
        // Đổi sang enum đúng với backend, ví dụ: "ENABLED"/"DISABLED"
        const newStatus = account.status === 'ENABLE' ? 'DISABLE' : 'ENABLE';
        await updateStatus(account.id, newStatus);
        setAccounts(prev =>
            prev.map(a =>
                a.id === account.id ? { ...a, status: newStatus } : a
            )
        );
    } catch (e) {
        alert(e);
    } finally {
        setLoadingId(null);
    }
};

    return (
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
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <select
                        className="py-2 px-3 border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                        value={roleFilter}
                        onChange={e => setRoleFilter(e.target.value)}
                    >
                        <option value="">{t?.accountManagement?.allRoles}</option>
                        <option value="ADMIN">{t.accountManagement.admin}</option>
                        <option value="STAFF">{t.accountManagement.staff}</option>
                        <option value="MEMBER">{t.accountManagement.member}</option>
                        <option value="TRANSPORTER">{t.accountManagement.transporter}</option>
                    </select>
                    <select
                        className="py-2 px-3 border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                    >
                        <option value="">{t.accountManagement.allStatus}</option>
                        <option value="ENABLE">{t.accountManagement.enable}</option>
                        <option value="DISABLE">{t.accountManagement.disable}</option>
                    </select>

                    <button className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md flex items-center space-x-2 transition-colors"
                        onClick={() => setShowAddForm(true)}>
                        <span className="text-lg">+</span>
                        <span>{t.accountManagement.addUser}</span>
                    </button>
                </div>
            </div>
            <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold">{t.accountManagement.addUser}</DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-4 py-2">
                        {/* Name - Hàng 1 */}
                        {/* <div className="space-y-1">
                            <label className="block text-sm text-gray-600">Name</label>
                            <input
                                className="w-full px-3 py-2 h-10 border rounded-md focus:ring-1 focus:ring-red-500"
                                placeholder="Full name"
                                value={newUser.name}
                                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                            />
                        </div> */}

                        {/* Email - Hàng 2 */}
                        <div className="space-y-1">
                            <label className="block text-sm text-gray-600">Email</label>
                            <input
                                className="w-full px-3 py-2 h-10 border rounded-md focus:ring-1 focus:ring-red-500"
                                placeholder="user@example.com"
                                value={newUser.email}
                                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="block text-sm text-gray-600">{t.accountManagement.password}</label>
                            <input
                                className="w-full px-3 py-2 h-10 border rounded-md focus:ring-1 focus:ring-red-500"
                                type="password"
                                placeholder="Password"
                                value={newUser.password}
                                onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                            />
                        </div>

                        {/* Role - Hàng 3 */}
                        <div className="space-y-1">
                            <label className="block text-sm text-gray-600">{t.accountManagement.role}</label>
                            <select
                                className="w-full px-3 py-2 h-10 border rounded-md focus:ring-1 focus:ring-red-500"
                                value={newUser.role}
                                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                            >
                                <option value="MEMBER">{t.accountManagement.member}</option>
                                <option value="STAFF">{t.accountManagement.staff}</option>
                                <option value="TRANSPORTER">{t.accountManagement.transporter}</option>
                                <option value="ADMIN">{t.accountManagement.admin}</option>
                            </select>
                        </div>

                        {/* Status - Hàng 4 */}
                        <div className="space-y-1">
                            <label className="block text-sm text-gray-600">{t.accountManagement.status}</label>
                            <select
                                className="w-full px-3 py-2 h-10 border rounded-md focus:ring-1 focus:ring-red-500"
                                value={newUser.status}
                                onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
                            >
                                <option value="ENABLE">{t.accountManagement.enable}</option>
                                <option value="DISABLE">{t.accountManagement.disable}</option>
                            </select>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="block text-sm text-gray-600">{t.accountManagement.avatar}</label>
                        <input
                            className="w-full px-3 py-2 h-10 border rounded-md focus:ring-1 focus:ring-red-500"
                            placeholder="Avatar URL"
                            value={newUser.avatar}
                            onChange={e => setNewUser({ ...newUser, avatar: e.target.value })}
                        />
                    </div>

                    <DialogFooter className="mt-4">
                        <button
                            className="px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
                            onClick={async () => {
                                if (!newUser.email || !newUser.password) {
                                    alert('Vui lòng điền email và mật khẩu');
                                    return;
                                }
                                try {
                                    const payload = {
                                        email: newUser.email,
                                        password: newUser.password,
                                        role: newUser.role,
                                        status: newUser.status,
                                        avatar: newUser.avatar
                                    };
                                    const res = await createProfile(payload);
                                    // Nếu trả về chuỗi, kiểm tra status hoặc nội dung
                                    if (typeof res === "string" && res.toLowerCase().includes("success")) {
                                        setShowAddForm(false);
                                        setNewUser({ email: '', password: '', role: 'MEMBER', status: 'ENABLE', avatar: '' });
                                        await fetchAccounts(); // Đảm bảo gọi lại lấy danh sách
                                    } else {
                                        alert(t.accountManagement.createAccountFailed);
                                    }
                                } catch (e) {
                                    alert(t.accountManagement.createAccountFailed);
                                }
                            }}
                        >
                            {t.accountManagement.saveUser}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {/* Accounts Table */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                {/* Table Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500">
                        <div className="col-span-3">{t.accountManagement.name}</div>
                        <div className="col-span-3">{t.accountManagement.email}</div>
                        <div className="col-span-2">{t.accountManagement.role}</div>
                        <div className="col-span-2">{t.accountManagement.status}</div>
                        <div className="col-span-2">{t.accountManagement.actions}</div>
                    </div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-gray-200">
                    {filteredAccounts.map((account) => (
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
                                            <p className="text-xs text-gray-500">{t.accountManagement.lastLogin}: {account.lastLogin}</p>
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

                                    {account.status === 'ENABLE' ? (
                                        <button
                                            className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-xs font-medium"
                                            onClick={() => handleStatus(account)}
                                            disabled={loadingId === account.id}
                                        >
                                            {t.accountManagement.disable}
                                        </button>
                                    ) : (
                                        <button
                                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-xs font-medium"
                                            onClick={() => handleStatus(account)}
                                            disabled={loadingId === account.id}
                                        >
                                            {t.accountManagement.enable}
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