export const priceFormat = (
  locale = 'pt-BR',
  options?: Intl.NumberFormatOptions
) => {
  const NumberFormat = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'BRL',
    ...options
  });

  const {
    format,
    formatToParts,
  } = NumberFormat

  return {
    format,
    formatToParts,
  }
}
