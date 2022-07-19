// ./src/utils/formatters/formatText.ts
const capitalizedFirstLetter = (text: string): string => {
  /**
   * Entrada: melancia açucarada
   * Saída: Melancia açucarada
   */
  const firstLetter = text.substring(0, 1);
  const rest = text.substring(1);

  const textFormated = `${firstLetter.toUpperCase()}${rest}`;

  return textFormated;
};

const removeAllNonDigits = (text: string): string => {
  /**
   * Entrada: Alô @ nova 147 da, casa.
   * Saída: 147
   */
  return text.replace(/[^\d]+/g, '');
};

const numberSeparatedByThousand = (text: string | number): string => {
  return `${text}`.replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, '$1.');
};

export default {
  capitalizedFirstLetter,
  removeAllNonDigits,
  numberSeparatedByThousand,
};
