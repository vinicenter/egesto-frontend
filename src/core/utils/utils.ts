import dayjs from '~utils/dayjs'

export function resolve(path: string, obj: any, separator: string = '.') {
  const properties = Array.isArray(path) ? path : path.split(separator)
  return properties.reduce((prev, curr) => prev?.[curr], obj)
}

export function downloadBlob(blobData: Blob, fileName: string, type: string) {
  const date = dayjs().format('DD/MM/YYYY HH:mm')

  const link = document.createElement('a');

  link.href = window.URL.createObjectURL(blobData);
  link.download = `eGesto - ${fileName} ${date}.${type}`;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
}
