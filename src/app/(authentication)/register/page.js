'use client'
import { loginGoogle, register } from '@/apis/auth';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { genAvatar } from '@/apis/user';
import { useUserProfile } from '@/context/user_context';
import { resendOtp } from '@/apis/auth';
import { useLanguage } from '@/context/language_context';
import { validateEmail } from '@/utils/utils';

export default function RegisterPage() {
  const { loggedIn, account } = useUserProfile();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { t } = useLanguage();
  const router = useRouter();

  const handleResendOtp = async () => {
    try {
      if (!email) {
        toast.warning(t?.auth?.placeholder?.email);
        return;
      }
      const result = await resendOtp(email);
      toast.success(result?.message || t?.auth?.placeholder?.OtpReSendS);
    } catch (error) {
      toast.error(error?.message || t?.auth?.placeholder?.OtpReSendError);
    }
  };
    const handleLoginGoogle = async () => {
      await loginGoogle();
    }

  async function getAvatarAsBase64(name) {
    const url = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
  useEffect(() => {
    if (loggedIn) {
      if (account && account.role === 'ADMIN') {
        router.push('/admins/dashboard');
      } else if (account && account.role === 'STAFF') {
        router.push('/staffs/dashboard');
      } else {
        router.push('/');
      }
    }
  }, [loggedIn, router, account]);
  const handleRegister = async () => {
    if (!name || !email || !password) {
      toast.warning(t?.auth?.placeholder?.blank);
      return;
    }
    if (password !== confirmPassword) {
      toast.warning(t?.auth?.placeholder?.passwordMismatch);
      return;
    }
    if (!validateEmail(email)) {
      toast.warning("Email is not valid!");
      return;
    }
    try {
      setLoading(true);
      const avatarBase64 = await getAvatarAsBase64(name.trim());
      const account = {
        email,
        password,
      };
      const message = await register(account, name);
      if (message === "verification email sent") {
        router.push(`/verify?email=${email}`);
      }
    } catch (error) {
      toast.warning(error.password);
    }
    setLoading(false);
  }

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">{t?.navbar?.register}</h1>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">{t?.auth?.fullName}</label>
          <input
            type="text"
            placeholder={t?.example?.nameExample}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            placeholder={t?.message?.plsE}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">{t?.auth?.password}</label>
          <input
            type="password"
            placeholder={t?.example?.enterPassword}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">{t?.auth?.confirmPassword}</label>
          <input
            type="password"
            placeholder={t?.auth?.confirmPassword}
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
            t?.auth?.createAccount
          )}
        </button>

        <div className="flex flex-col gap-3 mb-6">
          <button className="w-full border border-gray-300 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50" onClick={handleLoginGoogle}>
            <Image src="https://www.svgrepo.com/show/475656/google-color.svg" width={10} height={10} alt="Google" className="w-5 h-5" />
            <span>{t?.auth?.registerWithGoogle}</span>
          </button>
        </div>

        <p className="text-sm text-center">
          {t?.auth?.alreadyhadAccount}{' '}
          <a href="/login" className="text-blue-600 hover:underline">{t?.auth?.loginNow}</a>
        </p>
      </div>
    </div>
  );
}