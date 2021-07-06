const STANDARD_WIDTH = 375
const STANDARD_HEIGHT = 812

export const getHeight = (h, viewport) => {
  return Math.round(viewport.height / STANDARD_HEIGHT * h)
}

export const getWidth = (w, viewport) => {
  return Math.round(viewport.width / STANDARD_WIDTH * w)
}

export const fontSize = (fs, viewport) => {
  const res = viewport.width < STANDARD_WIDTH ? getHeight(fs, viewport) : fs
  return res
}
