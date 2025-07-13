/**
 * Next.js Middleware: Tự động redirect về locale phù hợp
 * - Nếu truy cập `/` sẽ tự động chuyển về `/vi` hoặc `/en` dựa vào header hoặc cookie
 * - Nếu đã có locale trong URL thì không làm gì
 */

import { NextResponse } from 'next/server';
import acceptLanguage from 'accept-language';

acceptLanguage.languages(['en', 'vi']);

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // Nếu đã có locale trong URL, không làm gì
  if (pathname.startsWith('/en') || pathname.startsWith('/vi') || pathname.startsWith('/_next')) {
    return NextResponse.next();
  }

  // Lấy locale từ cookie hoặc header
  let locale = req.cookies.get('NEXT_LOCALE')?.value;
  if (!locale) {
    locale = acceptLanguage.get(req.headers.get('Accept-Language'));
  }
  if (!locale) {
    locale = 'vi'; // default
  }

  // Redirect về locale phù hợp
  return NextResponse.redirect(new URL(`/${locale}${pathname}`, req.url));
}

// Chỉ áp dụng middleware cho các route gốc (không áp dụng cho static files, API, ...)
export const config = {
  matcher: [
    /*
      Match tất cả các route gốc, trừ:
      - /_next
      - /api
      - /static
      - /favicon.ico
      - /robots.txt
    */
    '/((?!_next|api|static|favicon.ico|robots.txt).*)',
  ],
};