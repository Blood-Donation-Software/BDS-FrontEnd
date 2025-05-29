import Image from 'next/image'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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
                <NavigationMenu>
                    <NavigationMenuItem>
                    <Link href="/" passHref legacyBehavior>
                        <NavigationMenuLink className="font-semibold text-lg px-4 py-2 rounded-md hover:bg-gray-100 transition-colors">
                            Trang chủ
                        </NavigationMenuLink>
                    </Link>
                    </NavigationMenuItem>
                </NavigationMenu>

                <NavigationMenuItem>
                <Link href="/about" passHref legacyBehavior>
                    <NavigationMenuLink className="font-semibold px-4 py-2 text-lg rounded-md hover:bg-gray-100 transition-colors">
                    Giới thiệu
                    </NavigationMenuLink>
                </Link>
                </NavigationMenuItem>

                {/* Hiến máu dropdown */}
                <NavigationMenu>
                <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-lg">Hiến máu</NavigationMenuTrigger>
                    <NavigationMenuContent className="min-w-[250px] px-4 py-2">
                        <Link href="/emergency-cases" passHref legacyBehavior>
                            <NavigationMenuLink>
                                Các trường hợp khẩn cấp
                            </NavigationMenuLink>
                        </Link>
                        <Link href="/donation-events" passHref legacyBehavior>
                            <NavigationMenuLink>
                                Các buổi hiến máu
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                </NavigationMenu>

                <NavigationMenuItem>
                <Link href="/blog" passHref legacyBehavior>
                    <NavigationMenuLink className="font-semibold px-4 py-2 rounded-md text-lg hover:bg-gray-100 transition-colors">
                    Blog
                    </NavigationMenuLink>
                </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                <Link href="/check-compatibility" passHref legacyBehavior>
                    <NavigationMenuLink className="font-semibold px-4 py-2 rounded-md text-lg hover:bg-gray-100 transition-colors">
                    Tra cứu tương thích
                    </NavigationMenuLink>
                </Link>
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
  );
}