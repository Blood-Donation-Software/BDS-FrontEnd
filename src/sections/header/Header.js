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

export default function Header() {
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
                    <NavigationMenuTrigger className="text-lg">Hiến máu</NavigationMenuTrigger>
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
                <Link href="/check-compatibility" className="font-semibold px-4 py-2 rounded-md text-lg hover:bg-gray-100 transition-colors">
                  Tra cứu tương thích
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-4">
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
        </div>
      </div>
    </header>
  )
}
