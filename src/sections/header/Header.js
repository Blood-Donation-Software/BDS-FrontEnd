'use client'
import Image from 'next/image'
import Link from 'next/link'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useUserProfile } from '@/context/user_context'
import { logout } from '@/apis/auth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner'
import Avatar from '@/components/ui/avatar';

export default function Header() {
  const { account, isLoading, loggedIn, profile, setProfile, setAccount, setLoggedIn } = useUserProfile();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      setProfile(null);
      setAccount(null);
      setLoggedIn(false);
      router.push('/login');
      toast.success("Đăng xuất thanh công!");
    } catch (error) {
      toast.error("Đăng xuất thất bại, vui lòng thử lại sau!");
      toast.error(error?.response?.data?.message || "Lỗi không xác định");
    }
  }

  return (
    <header className="w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            <Image
              src="/logo.jpg"
              alt="Logo"
              width={75}
              height={75}
              className="rounded"
            />
          </Link>
        </div>

        {/* Navigation */}
        <NavigationMenu>
          <NavigationMenuList className="flex items-center space-x-2">
            <NavigationMenuItem>
              <NavigationMenuLink asChild className="text-lg">
                <Link href="/" className="font-semibold text-lg px-4 py-2 rounded-md hover:bg-gray-100 transition-colors">
                  Trang chủ
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild className="text-lg">
                <Link href="/about" className="font-semibold px-4 py-2 text-lg rounded-md hover:bg-gray-100 transition-colors">
                  Giới thiệu
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Hiến máu dropdown */}
            <NavigationMenu>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-lg font-semibold">Hiến máu</NavigationMenuTrigger>
                <NavigationMenuContent className="min-w-[250px] px-4 py-2 bg-white rounded-md shadow-md space-y-2">
                  <NavigationMenuLink asChild>
                    <Link href="/emergency-cases" className="block px-2 py-1 hover:bg-gray-100 rounded">
                      Các trường hợp khẩn cấp
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link href="/donation-events" className="block px-2 py-1 hover:bg-gray-100 rounded">
                      Các buổi hiến máu
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenu>


            <NavigationMenuItem>
              <NavigationMenuLink asChild className="text-lg">
                <Link href="/blog" className="font-semibold px-4 py-2 rounded-md text-lg hover:bg-gray-100 transition-colors">
                  Blog
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild className="text-lg">
                <Link href="/blood-compatibility" className="font-semibold px-4 py-2 rounded-md text-lg hover:bg-gray-100 transition-colors">
                  Tra cứu tương thích
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>        {/* Auth/User Avatar */}
        <div className="flex items-center space-x-4">
          {loggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="focus:outline-none flex items-center space-x-3 hover:bg-gray-50 rounded-full p-2 transition-colors">
                  {/* Avatar */}                  <Avatar
                    src={account?.avatar}
                    name={profile?.name}
                    email={account?.email}
                    size={40}
                    className="hover:ring-2 hover:ring-blue-200"
                  />

                  {/* User name with role badge */}
                  <div className="flex flex-col items-start text-left">
                    <span className="font-semibold text-sm text-gray-800 leading-tight">
                      {profile?.name || account?.email || 'Người dùng'}
                    </span>                    {account?.role && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${account.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                        account.role === 'STAFF' ? 'bg-blue-100 text-blue-700' :
                          account.role === 'MEMBER' ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-700'
                        }`}>
                        {account.role === 'ADMIN' ? 'Quản trị viên' :
                          account.role === 'STAFF' ? 'Nhân viên' :
                            account.role === 'MEMBER' ? 'Thành viên' : 'Khách'}
                      </span>
                    )}
                  </div>

                  {/* Dropdown arrow */}
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    {profile?.name || account?.email}
                  </p>
                  <p className="text-xs text-gray-500">{account?.email}</p>
                </div>
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Thông tin cá nhân
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                    Bảng điều khiển
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Cài đặt
                  </Link>
                </DropdownMenuItem>
                <div className="border-t border-gray-100 my-1"></div>
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="text-black text-lg rounded-full font-semibold px-6">
                  Đăng nhập
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-red-600 hover:bg-red-700 text-white text-lg font-semibold px-6 rounded-full">
                  Đăng ký
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
