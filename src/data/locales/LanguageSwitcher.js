'use client'
import { useLanguage } from '@/context/language_context';

export default function LanguageSwitcher() {
  const { setSelectedLanguage } = useLanguage();
  return (
    <div className="flex justify-end mb-4 gap-2">
      <button
        onClick={() => {
          console.log('Set EN');
          setSelectedLanguage('en');
        }}
        className="px-2 py-1 border rounded"
      >
        EN
      </button>
      <button
        onClick={() => {
          console.log('Set VIE');
          setSelectedLanguage('vie');
        }}
        className="px-2 py-1 border rounded"
      >
        VIE
      </button>
    </div>
  );
}