function isValidEmail(email: string): boolean {
  if (!email) return false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidEnumValue<E>(enumObj: E, value: string): boolean {
  if (!value) return false;
  return Object.values(enumObj).includes(value);
}

export { isValidEnumValue, isValidEmail };
