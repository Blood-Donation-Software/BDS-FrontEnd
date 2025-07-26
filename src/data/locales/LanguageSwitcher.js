'use client'
import { useLanguage } from '@/context/language_context';

export default function LanguageSwitcher() {
  const { selectedLanguage, setSelectedLanguage } = useLanguage();
  return (
    <div className="flex justify-end mb-4 gap-2">
      <button
        onClick={() => {
          console.log('Set EN');
          setSelectedLanguage('en');
        }}
        className={`px-4 py-1.5 border rounded-full text-sm font-medium shadow-sm transition-all ${
          selectedLanguage === 'en'
            ? 'bg-red-500 text-white border-red-500'
            : 'bg-white text-gray-800 border-gray-300 hover:bg-red-50 hover:border-red-400'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => {
          console.log('Set VIE');
          setSelectedLanguage('vie');
        }}
        className={`px-4 py-1.5 border rounded-full text-sm font-medium shadow-sm transition-all ${
          selectedLanguage === 'vie'
            ? 'bg-red-500 text-white border-red-500'
            : 'bg-white text-gray-800 border-gray-300 hover:bg-red-50 hover:border-red-400'
        }`}
      >
        VIE
      </button>
    </div>
  );
}
