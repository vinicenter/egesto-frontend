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

const hslToHex = (h: number, s: number, l: number) => {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export function generateRandomHexColor() {
  const hue = Math.floor(Math.random() * 360)

  return hslToHex(hue, 100, 50)
}
