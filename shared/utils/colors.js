export function withOpacity (color, opacity) {
  return `#${(parseInt(color.substring(1), 16) << 8 | opacity * 255).toString(16)}`
}