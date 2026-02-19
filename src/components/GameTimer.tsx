import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface Props {
  timeLeft: number;
  totalTime: number;
}

export default function GameTimer({ timeLeft, totalTime }: Props) {
  const isLow = timeLeft <= 10;
  const ringColor = isLow ? '#c62828' : '#6750A4';

  const animOffset = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const targetOffset = CIRCUMFERENCE * (1 - timeLeft / totalTime);
    Animated.timing(animOffset, {
      toValue: targetOffset,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [timeLeft, totalTime]);

  useEffect(() => {
    scaleAnim.setValue(1.2);
    opacityAnim.setValue(0.7);
    Animated.parallel([
      Animated.timing(scaleAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
  }, [timeLeft]);

  return (
    <View style={styles.container}>
      <Svg
        width={140}
        height={140}
        viewBox="0 0 120 120"
        style={styles.svg}
      >
        {/* Background ring */}
        <Circle
          cx={60}
          cy={60}
          r={RADIUS}
          fill="none"
          stroke="#e0e0e0"
          strokeWidth={8}
        />
        {/* Progress ring */}
        <AnimatedCircle
          cx={60}
          cy={60}
          r={RADIUS}
          fill="none"
          stroke={ringColor}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={animOffset}
        />
      </Svg>
      <Animated.Text
        style={[
          styles.number,
          isLow && styles.numberLow,
          { transform: [{ scale: scaleAnim }], opacity: opacityAnim },
        ]}
      >
        {timeLeft}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    position: 'absolute',
    transform: [{ rotate: '-90deg' }],
  },
  number: {
    fontSize: 36,
    fontWeight: 'bold',
    fontVariant: ['tabular-nums'],
    color: '#6750A4',
  },
  numberLow: {
    color: '#c62828',
  },
});
