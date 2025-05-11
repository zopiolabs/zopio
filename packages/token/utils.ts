function encodeBase64(obj: any): string {
  return Buffer.from(JSON.stringify(obj)).toString('base64url');
}

function decodeBase64<T = any>(b64: string): T {
  return JSON.parse(Buffer.from(b64, 'base64url').toString());
}

function now(): number {
  return Math.floor(Date.now() / 1000);
}

export { encodeBase64, decodeBase64, now };