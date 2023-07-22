import minimumFractionDigits from '~constants/minimumFractionDigits'

export const numberFormat = (
  locale = 'pt-BR',
  options?: Intl.NumberFormatOptions
) => {
  const {
    format,
    formatToParts,
  } = new Intl.NumberFormat(locale, {
    style: 'decimal',
    minimumFractionDigits,
    ...options
  });

  return {
    format: (number?: number) => number ? format(number) : '-',
    formatToParts,
  }
}

export const priceFormat = () => {
  const { format, formatToParts } = numberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  return {
    formatPrice: format,
    formatPriceToParts: formatToParts,
  }
}
