export function shortenAddress(addr: string, chars = 4): string {
  if (addr.length <= chars * 2) return addr;
  return `${addr.slice(0, chars)}…${addr.slice(-chars)}`;
}
