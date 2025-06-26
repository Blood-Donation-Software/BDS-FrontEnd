import React from 'react'
import { FaLock, FaTrashAlt } from "react-icons/fa";

export default function Security() {
    return (
        <div className="w-full mx-auto border-2 border-blue-300 rounded-xl p-6 bg-white shadow-sm relative">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Security Settings</h2>
            </div>

            {/* Password Section */}
            <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-white rounded-lg p-5 mb-4">
                <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                        <FaLock className="text-blue-600 text-xl" />
                    </div>
                    <div>
                        <div className="font-semibold text-lg">Password</div>
                        <div className="text-gray-500 text-sm">Change your account password</div>
                    </div>
                </div>
                <button className="bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2 rounded-lg transition">
                    Change Password
                </button>
            </div>

            {/* Delete Account Section */}
            <div className="flex items-center justify-between bg-gradient-to-r from-red-100 to-white rounded-lg p-5">
                <div className="flex items-center gap-4">
                    <div className="bg-red-200 p-3 rounded-full">
                        <FaTrashAlt className="text-red-600 text-xl" />
                    </div>
                    <div>
                        <div className="font-semibold text-lg text-red-700">Delete Account</div>
                        <div className="text-gray-500 text-sm">Permanently delete your account and all data</div>
                    </div>
                </div>
                <button className="bg-gradient-to-r from-red-500 to-orange-400 hover:from-red-600 hover:to-orange-500 text-white font-semibold px-5 py-2 rounded-lg transition">
                    Delete Account
                </button>
            </div>
        </div>
    )
}
