import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React, { useContext, useState } from 'react'
import { FaLock, FaTrashAlt } from "react-icons/fa";
import { toast } from 'sonner';
import { updatePassword } from '@/apis/user';
import { UserContext } from '@/context/user_context';

export default function Security() {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const { profile, loggedIn, account, setProfile } = useContext(UserContext);

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
            toast.error("Please fill in all fields");
            return;
        }

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        if (passwordForm.newPassword.length < 6) {
            toast.error("New password must be at least 6 characters long");
            return;
        }

        setIsLoading(true);

        try {
            await updatePassword(passwordForm.oldPassword, passwordForm.newPassword);
            toast.success("Password updated successfully!");
            setOpen(false);
            setPasswordForm({
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            console.error("Password update error:", error);
            if (error?.message) {
                toast.error(error.message);
            } else if (typeof error === 'string') {
                toast.error(error);
            } else {
                toast.error("Failed to update password. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="w-full mx-auto border-2 border-blue-300 rounded-xl p-6 bg-white shadow-sm relative">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Security Settings</h2>
            </div>

            {/* Password Section */}
            <div className="flex items-center justify-between rounded-lg p-5 mb-4">
                <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                        <FaLock className="text-blue-600 text-xl" />
                    </div>
                    <div>
                        <div className="font-semibold text-lg">Password</div>
                        <div className="text-gray-500 text-sm">Change your account password</div>
                    </div>
                </div>
                <Dialog open={open} onOpenChange={setOpen} >
                    <DialogTrigger asChild>
                        <Button variant="outline" className="bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2 rounded-lg transition">Change Password</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Change Password</DialogTitle>
                            <DialogDescription>
                                Enter your current password and choose a new password.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handlePasswordSubmit}>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="oldPassword">Current Password</Label>
                                    <Input
                                        id="oldPassword"
                                        name="oldPassword"
                                        type="password"
                                        value={passwordForm.oldPassword}
                                        onChange={handlePasswordChange}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="newPassword">New Password</Label>
                                    <Input
                                        id="newPassword"
                                        name="newPassword"
                                        type="password"
                                        value={passwordForm.newPassword}
                                        onChange={handlePasswordChange}
                                        required
                                        minLength={6}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        value={passwordForm.confirmPassword}
                                        onChange={handlePasswordChange}
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline" type="button">Cancel</Button>
                                </DialogClose>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? "Updating..." : "Update Password"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

            </div>

            {/* Delete Account Section */}
            <div className="flex items-center justify-between rounded-lg p-5">
                <div className="flex items-center gap-4">
                    <div className="bg-red-200 p-3 rounded-full">
                        <FaTrashAlt className="text-red-600 text-xl" />
                    </div>
                    <div>
                        <div className="font-semibold text-lg text-red-700">Delete Account</div>
                        <div className="text-gray-500 text-sm">Permanently delete your account and all data</div>
                    </div>
                </div>
                <Button variant="outline" className="bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2 rounded-lg transition">Delete Account</Button>
            </div>
        </div>
    )
}
