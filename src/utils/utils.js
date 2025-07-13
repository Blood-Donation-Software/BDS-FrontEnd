import en from '@/data/locales/en';
import vie from '@/data/locales/vie';
export const convertBloodType = (bloodType) => {
  const [type, rh] = bloodType.split('_');
  if (!type || !rh) return bloodType;
  let rhSign = '';
  switch (rh) {
    case 'POSITIVE':
      rhSign = '+';
      break;
    case 'NEGATIVE':
      rhSign = '-';
      break;
    default:
      return bloodType;
  }
  return `${type}${rhSign}`;

}



export async function getDictionary(lang) {
  switch (lang) {
    case 'en':
      return (await import('@/data/locales/en.json')).default;
    case 'vie':
      return (await import('@/data/locales/vie.json')).default;
    default:
      return (await import('@/data/locales/en.json')).default;
  }

}
