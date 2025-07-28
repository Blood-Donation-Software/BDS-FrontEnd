'use client'
import { useLanguage } from '@/context/language_context';

export default function LanguageSwitcher() {
  const { selectedLanguage, setSelectedLanguage } = useLanguage();
  
  return (
    <div className="flex bg-gray-100 rounded-lg justify-end p-1 shadow-sm">
      <button
        onClick={() => setSelectedLanguage('en')}
        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
          selectedLanguage === 'en'
            ? 'bg-white text-red-600 shadow-sm ring-1 ring-red-200'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
        }`}
      >
        <span>EN</span>
      </button>
      
      <button
        onClick={() => setSelectedLanguage('vie')}
        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
          selectedLanguage === 'vie'
            ? 'bg-white text-red-600 shadow-sm ring-1 ring-red-200'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
        }`}
      >
        <span>VN</span>
      </button>
    </div>
  );
}