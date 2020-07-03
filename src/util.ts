export const convertStringToEnum = <T>(
  enumType: T,
  value: string,
): T[keyof T] | undefined => {
  const keyAndValue = Object.entries(enumType).find(
    ([, enumValue]) => enumValue == value,
  );

  return keyAndValue ? keyAndValue[1] : undefined;
};

export const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
