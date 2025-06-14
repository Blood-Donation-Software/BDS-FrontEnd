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