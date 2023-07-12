import minimumFractionDigits from '~constants/minimumFractionDigits'

export const priceFormat = (
  locale = 'pt-BR',
  options?: Intl.NumberFormatOptions
) => {
  const NumberFormat = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits,
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
