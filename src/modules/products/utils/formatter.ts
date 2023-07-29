export const formatProductNameWithCode = (name?: string, code?: string) => {
  return `${code}${code && name ? ' - ' : ' '}${name}`.trim()
}