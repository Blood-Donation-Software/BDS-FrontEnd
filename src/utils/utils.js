export const convertBloodType = (bloodType) => {
  if(!bloodType) return null  ;
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

export const convertDonationRegistrationStatus = (status) => {
  switch (status) {
    case 'PENDING':
      return 'Chưa tới ngày hiến';
    case 'REJECTED':
      return 'Từ chối checkin';
    case 'CANCELED':
      return 'Đã hủy';
    case 'CHECKED_IN':
      return 'Đã checkin';
    default:
      return status;
  }
}

export const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};