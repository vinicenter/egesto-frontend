export function resolve(path: string, obj: any, separator: string = '.') {
  const properties = Array.isArray(path) ? path : path.split(separator)
  return properties.reduce((prev, curr) => prev?.[curr], obj)
}
