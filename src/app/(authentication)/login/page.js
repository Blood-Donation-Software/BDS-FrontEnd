'use client'
import { login, loginGoogle } from '@/apis/auth';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const handleLoginEmail = async () => {
    try {
      const message = await login({email,password});
      if(message && message === "Login successful"){
        router.push("/");
      }
    } catch(error) {
      toast.warning("Invalid Credentials")
    }
  }

  const handleLoginGoogle = async () => {
    await loginGoogle();
  }
  
  return (
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

          <button className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 mb-6"
                  onClick={handleLoginEmail}
          >
            Đăng nhập
          </button>

          <div className="flex items-center justify-between mb-4">
            <hr className="w-1/4 border-gray-300" />
            <span className="text-sm text-gray-500">Or:</span>
            <hr className="w-1/4 border-gray-300" />
          </div>

          <div className="flex flex-col gap-3 mb-6">
            <button className="w-full border border-gray-300 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50"
                    onClick={handleLoginGoogle}
            >
              <Image src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              <span>Đăng nhập qua Google</span>
            </button>

            <button className="w-full border border-gray-300 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50">
              <Image src="https://www.svgrepo.com/show/512317/github-142.svg" alt="GitHub" className="w-5 h-5" />
              <span>Đăng nhập qua Github</span>
            </button>
          </div>

          <p className="text-sm text-center">
            Chưa có tài khoản?{' '}
            <a href="/register" className="text-blue-600 hover:underline">Đăng ký ngay</a>
          </p>
        </div>
      </div>
  );
}