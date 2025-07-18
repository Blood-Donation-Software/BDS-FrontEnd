'use client';
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import { FiMapPin, FiPhone, FiMail } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language_context";

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-[#151C27] text-[#e3e9f3] pt-10 pb-4 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between gap-8">
        {/* Logo & Social */}
        <div className="flex-1 min-w-[210px]">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-red-500 text-2xl">
              {/* Blood drop SVG icon */}
              <svg width="22" height="22" viewBox="0 0 20 20" fill="none"><path d="M10 2C10 2 3 9.42 3 13.24C3 16.07 6.13 18 10 18C13.87 18 17 16.07 17 13.24C17 9.42 10 2 10 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
            <span className="text-white font-bold text-lg">Hopewell</span>
          </div>
          <p className="text-sm mb-4">
            {t?.footer?.about}
          </p>
          <div className="flex gap-4 text-xl">
            <a href="#" aria-label="Facebook" className="hover:text-red-500 transition"><FaFacebookF /></a>
            <a href="#" aria-label="Twitter" className="hover:text-red-500 transition"><FaTwitter /></a>
            <a href="#" aria-label="Instagram" className="hover:text-red-500 transition"><FaInstagram /></a>
          </div>
        </div>
        {/* Quick Links */}
        <div className="flex-1 min-w-[180px]">
          <h4 className="font-semibold text-white mb-2">{t?.footer?.quick_links}</h4>
          <ul className="space-y-1 text-sm">
            <li><a href="#" className="hover:text-red-400 transition">{t?.footer?.register_donate}</a></li>
            <li><a href="#" className="hover:text-red-400 transition">{t?.footer?.emergency_request}</a></li>
            <li><a href="#" className="hover:text-red-400 transition">{t?.footer?.compatibility_lookup}</a></li>
            <li><a href="#" className="hover:text-red-400 transition">{t?.footer?.blogt}</a></li>
          </ul>
        </div>
        {/* Contact */}
        <div className="flex-1 min-w-[230px]">
          <h4 className="font-semibold text-white mb-2">{t?.footer?.contact}</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <FiMapPin className="text-red-500 mt-1" />
              <span>{t?.footer?.address}</span>
            </li>
            <li className="flex items-center gap-2">
              <FiPhone className="text-red-500" />
              <span>+84 123 456 789</span>
            </li>
            <li className="flex items-center gap-2">
              <FiMail className="text-red-500" />
              <span>contact@hopewell.vn</span>
            </li>
          </ul>
        </div>
        {/* Newsletter */}
        <div className="flex-1 min-w-[230px]">
          <h4 className="font-semibold text-white mb-2">{t?.footer?.newsletter}</h4>
          <p className="text-sm mb-3">
            {t?.footer?.subscribe_info}
          </p>
          <form className="flex">
            <Input
              type="email"
              placeholder={t?.footer?.placeholder_email}
              className="flex-1 rounded-l-md px-4 py-2 bg-[#232B39] text-white border-0 outline-none text-sm placeholder-[#B6C6E3] rounded-none"
            />
            <Button
              type="submit"
              className="bg-[#ee4040] hover:bg-[#e43a3a] text-white font-semibold px-5 rounded-r-md rounded-none transition"
            >
              {t?.footer?.submit}
            </Button>
          </form>
        </div>
      </div>
      {/* Divider */}
      <div className="border-t border-[#232B39] my-7"></div>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-[#B6C6E3] px-2">
        <div>{t?.footer?.rights_reverved}</div>
        <div className="flex items-center gap-1">
          <span>{t?.footer?.built_with}</span>
          <span className="text-red-500 text-base">♥</span>
          <span>{t?.footer?.by_team}</span>
        </div>
      </div>
    </footer>
  );
}