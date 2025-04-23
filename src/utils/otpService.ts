// This file is kept as a placeholder for future functionality
// All OTP verification functionality has been removed

export const formatPhoneNumber = (phone: string): string => {
  // Basic formatting for Indian phone numbers
  if (phone.length === 10) {
    return `+91 ${phone.substring(0, 5)}-${phone.substring(5)}`;
  }
  return phone;
};

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/; // Indian mobile number format
  return phoneRegex.test(phone);
};
