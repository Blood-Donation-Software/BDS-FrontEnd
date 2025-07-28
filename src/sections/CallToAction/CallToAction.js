'use client'
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useLanguage } from "@/context/language_context";


export default function CallToAction() {
  const { t } = useLanguage();
  return (
    <div className="relative w-full h-[500px] flex items-center justify-center overflow-hidden">
      {/* Background image with red overlay */}
      <Image
        src="/banner.jpg"
        alt="Blood donation"
        fill
        style={{ objectFit: "cover" }}
        className="z-0"
        priority
      />
      <div className="absolute inset-0 bg-red-600 opacity-80 z-10" />

      {/* Centered content */}
      <div className="relative z-20 flex flex-col items-center text-center px-4">
        <h1 className="text-5xl font-extrabold be-vietnam-pro-semibold text-white leading-tight mb-2 drop-shadow-lg">
          {t?.homePage?.Name}<br />
          <span className="text-5xl font-extrabold be-vietnam-pro-semibold">{t?.homePage?.Center_Name}</span>
        </h1>
        <p className="text-xl text-white mt-2 mb-8 max-w-2xl">
          {t?.homePage?.Description}
        </p>
        <div className="flex gap-4">
          <button className="bg-[rgba(242,243,245,1)] cursor-pointer text-red-600 font-semibold px-8 py-3 rounded-full text-lg shadow hover:bg-[rgba(242,243,245,0.5)] hover:text-white transition">
            {t?.homePage?.RegisterToBloodDonation}
          </button>
          <button className="bg-transparent border-2 cursor-pointer border-white text-white font-semibold px-8 py-3 rounded-full text-lg hover:bg-white hover:text-red-600 transition">
            {t?.homePage?.LearnMore}
          </button>
        </div>
      </div>
    </div>
  );
}