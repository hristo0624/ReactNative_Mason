import { Easing, Animated } from 'react-native'

const DURATION = 300

export function fromBottom (duration = DURATION) {
  return {
    transitionSpec: {
      duration,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true
    },
    screenInterpolator: ({ layout, position, scene }) => {
      const { index } = scene
      const { initHeight } = layout

      const translateY = position.interpolate({
        inputRange: [index - 1, index, index + 1],
        outputRange: [initHeight, 0, 0]
      })

      const opacity = position.interpolate({
        inputRange: [index - 1, index - 0.99, index],
        outputRange: [0, 1, 1]
      })

      return { opacity, transform: [{ translateY }] }
    }
  }
}

export function fromLeft (duration = DURATION) {
  return {
    transitionSpec: {
      duration,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true
    },
    screenInterpolator: ({ layout, position, scene }) => {
      const { index } = scene
      const { initWidth } = layout

      const translateX = position.interpolate({
        inputRange: [index - 1, index, index + 1],
        outputRange: [-initWidth, 0, 0]
      })

      const opacity = position.interpolate({
        inputRange: [index - 1, index - 0.99, index],
        outputRange: [0, 1, 1]
      })

      return { opacity, transform: [{ translateX }] }
    }
  }
}

export function fromRight (duration = DURATION) {
  return {
    transitionSpec: {
      duration,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true
    },
    screenInterpolator: ({ layout, position, scene }) => {
      const { index } = scene
      const { initWidth } = layout

      const translateX = position.interpolate({
        inputRange: [index - 1, index, index + 1],
        outputRange: [initWidth, 0, 0]
      })

      const opacity = position.interpolate({
        inputRange: [index - 1, index - 0.99, index],
        outputRange: [0, 1, 1]
      })

      return { opacity, transform: [{ translateX }] }
    }
  }
}
