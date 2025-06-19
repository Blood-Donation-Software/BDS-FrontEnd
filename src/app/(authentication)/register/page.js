'use client'
import { register } from '@/apis/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();
  const handleRegister = async () => {
    if(!name || !email || !password){
      toast.warning("Fields must not be bank!");
      return;
    }
    if (password !== confirmPassword){
      toast.warning("Password does not match!");
      return;
    }
    try{
      setLoading(true);
      const message = await register({email,password,name});
      console.log(message);
      if(message === "verification email sent"){
        router.push(`/verify?email=${email}`);
      }
    } catch(error){
      console.log(error);
    }
    setLoading(false);
  }

  return (
    <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Đăng Ký</h1>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Họ và Tên</label>
            <input
              type="text"
              placeholder="VD: Nguyễn Văn A"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

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

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Mật Khẩu</label>
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Xác nhận mật khẩu</label>
            <input
              type="password"
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          
          <button
            className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 mb-6 flex items-center justify-center"
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              'Tạo tài khoản'
            )}
          </button>

          <div className="flex flex-col gap-3 mb-6">
            <button className="w-full border border-gray-300 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50">
              <Image src="https://www.svgrepo.com/show/475656/google-color.svg" width={10} height={10} alt="Google" className="w-5 h-5" />
              <span>Đăng ký qua Google</span>
            </button>

            <button className="w-full border border-gray-300 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50">
              <Image src="https://www.svgrepo.com/show/512317/github-142.svg" width={10} height={10} alt="GitHub" className="w-5 h-5" />
              <span>Đăng ký qua Github</span>
            </button>
          </div>

          <p className="text-sm text-center">
            Đã có tài khoản?{' '}
            <a href="/login" className="text-blue-600 hover:underline">Đăng nhập ngay</a>
          </p>
        </div>
      </div>
  );
}