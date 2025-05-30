'use client'
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Phần banner bên trái */}
      <div className="hidden md:flex w-1/2 justify-center items-center flex-col px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">HighBridge</h1>
          <h2 className="text-xl font-semibold text-red-600">Giọt máu nghĩa tình - Kết nối trái tim</h2>
          <p className="mt-4 text-gray-700 max-w-md">
            HighBridge là cầu nối giữa người hiến máu và những bệnh nhân đang cần giúp đỡ. Mỗi hành động của bạn có thể cứu sống một người khác.
          </p>
        </div>
      </div>

      {/* Phần form đăng nhập bên phải */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Đăng Nhập</h1>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="Vui lòng nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <button className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 mb-6">
            Đăng nhập
          </button>

          <div className="flex items-center justify-between mb-4">
            <hr className="w-1/4 border-gray-300" />
            <span className="text-sm text-gray-500">Or:</span>
            <hr className="w-1/4 border-gray-300" />
          </div>

          <div className="flex flex-col gap-3 mb-6">
            <button className="w-full border border-gray-300 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              <span>Đăng nhập qua Google</span>
            </button>

            <button className="w-full border border-gray-300 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50">
              <img src="https://www.svgrepo.com/show/512317/github-142.svg" alt="GitHub" className="w-5 h-5" />
              <span>Đăng nhập qua Github</span>
            </button>
          </div>

          <p className="text-sm text-center">
            Chưa có tài khoản?{' '}
            <a href="/register" className="text-blue-600 hover:underline">Đăng ký ngay</a>
          </p>
        </div>
      </div>
    </div>
  );
}