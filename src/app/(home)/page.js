'use client';
import CallToAction from "@/sections/CallToAction/CallToAction";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useLanguage } from "@/context/language_context";
export default function Home() {
  const { t } = useLanguage();
  return (
    <>
      <CallToAction />
      
      {/* Statistics Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-red-600">{t?.homePage?.ImpactTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <h3 className="text-5xl font-bold text-red-600 mb-2">10,000+</h3>
              <p className="text-gray-600">{t?.homePage?.Impact1}</p>
            </div>
            <div className="p-6">
              <h3 className="text-5xl font-bold text-red-600 mb-2">50+</h3>
              <p className="text-gray-600">{t?.homePage?.Impact2}</p>
            </div>
            <div className="p-6">
              <h3 className="text-5xl font-bold text-red-600 mb-2">5,000+</h3>
              <p className="text-gray-600">{t?.homePage?.Impact3}</p>
            </div>
            <div className="p-6">
              <h3 className="text-5xl font-bold text-red-600 mb-2">24/7</h3>
              <p className="text-gray-600">{t?.homePage?.Impact4}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Process Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-red-600">{t?.homePage?.ProcessTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="bg-red-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <span className="text-red-600 text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">{t?.homePage?.Step1Title}</h3>
              <p className="text-gray-600">{t?.homePage?.Step1Desc}</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="bg-red-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <span className="text-red-600 text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">{t?.homePage?.Step2Title}</h3>
              <p className="text-gray-600">{t?.homePage?.Step2Desc}</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="bg-red-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <span className="text-red-600 text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">{t?.homePage?.Step3Title}</h3>
              <p className="text-gray-600">{t?.homePage?.Step3Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-red-600">{t?.homePage?.TestimonialTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-red-600 font-bold">TN</span>
                </div>
                <div>
                  <h4 className="font-semibold">Trần Ngọc Anh</h4>
                  <p className="text-gray-500 text-sm">{t?.homePage?.DonorRole}</p>
                </div>
              </div>
              <p className="text-gray-700 italic">{t?.homePage?.DonorQuote}</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-red-600 font-bold">LV</span>
                </div>
                <div>
                  <h4 className="font-semibold">Lê Văn Bình</h4>
                  <p className="text-gray-500 text-sm">{t?.homePage?.RecipientRole}</p>
                </div>
              </div>
                <p className="text-gray-700 italic">{t?.homePage?.RecipientQuote}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Secondary CTA Section */}
      <section className="py-16 bg-red-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">{t?.homePage?.CTA_Title}</h2>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
            {t?.homePage?.CTA_Description}
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="secondary" className="border-white text-red-600 hover:bg-red-700 hover:text-white px-8 py-6 text-lg font-semibold">
              {t?.homePage?.CTA_Button1}
            </Button>
            <Button variant="secondary" className="border-white text-red-600 hover:bg-red-700 hover:text-white px-8 py-6 text-lg font-semibold">
              {t?.homePage?.CTA_Button2}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}