'use client'
import { useLanguage } from '@/context/language_context';

export default function LanguageSwitcher() {
  const { selectedLanguage, setSelectedLanguage } = useLanguage();
  
  return (
    <div className="flex justify-end mb-4">
      <div className="inline-flex bg-white rounded-lg p-0.5 shadow-sm border border-gray-200">
        <button
          onClick={() => setSelectedLanguage('en')}
          className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
            selectedLanguage === 'en'
              ? 'bg-red-600 text-white shadow-sm'
              : 'text-gray-600 hover:bg-red-50'
          }`}
        >
          EN
        </button>
        <button
          onClick={() => setSelectedLanguage('vie')}
          className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
            selectedLanguage === 'vie'
              ? 'bg-red-600 text-white shadow-sm'
              : 'text-gray-600 hover:bg-red-50'
          }`}
        >
          VN
        </button>
      </div>
    </div>
  );
}