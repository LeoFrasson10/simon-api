export const generateKeyByString = (value: string) => {
  const key = value.trim().toLowerCase().replace(/ /g, '_');

  return key.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};
