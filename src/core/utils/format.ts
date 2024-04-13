import dayjs from '~utils/dayjs'
import minimumFractionDigits from '~constants/minimumFractionDigits'

export const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

function applyPastOrFutureInfo(humanizedString: string, ms: number) {
  const isPast = ms < 0
  const past = 'há %s'
  const future = 'em %s'

  return isPast
    ? past.replace('%s', humanizedString)
    : future.replace('%s', humanizedString)
}

export const humanizeDateRange = (
  start: string | Date,
  end: string | Date,
  withPastOrFutureInfo = true,
) => {
  const dateStart = dayjs(start)
  const dateEnd = dayjs(end)

  const duration = dayjs.duration(dateEnd!.diff(dateStart))

  return withPastOrFutureInfo
    ? applyPastOrFutureInfo(duration.humanize(), duration.asMilliseconds())
    : duration.humanize()
}

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

export const priceFormat = (options?: Intl.NumberFormatOptions) => {
  const { format, formatToParts } = numberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    ...options,
  })

  return {
    formatPrice: format,
    formatPriceToParts: formatToParts,
  }
}

export const removeCnpjFormat = (cnpj: string) => cnpj.replace(/\D/g, '')
