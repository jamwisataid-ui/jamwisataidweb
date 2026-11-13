import { useEffect, useRef, useState, type PropsWithChildren } from "react";
import { Animated, Easing, Platform, Pressable, type PressableProps, type StyleProp, type ViewStyle } from "react-native";

/**
 * Motion primitives built on React Native's core Animated API (native driver),
 * so they need no extra native module and behave the same on Android, iOS and web.
 */

type PressableScaleProps = Omit<PressableProps, "style" | "children"> & PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  /** Style for the outer touch target (e.g. `{ flex: 1 }` inside a row). */
  containerStyle?: StyleProp<ViewStyle>;
  /** Scale while pressed. */
  pressedScale?: number;
  /** Lift (px) on web hover. */
  hoverLift?: number;
}>;

/** Pressable that springs down on press and lifts slightly on hover (web). */
export function PressableScale({ style, containerStyle, children, pressedScale = 0.97, hoverLift = 3, onPressIn, onPressOut, onHoverIn, onHoverOut, disabled, ...props }: PressableScaleProps) {
  const [scale] = useState(() => new Animated.Value(1));
  const [lift] = useState(() => new Animated.Value(0));
  const spring = (value: Animated.Value, toValue: number) => Animated.spring(value, { toValue, useNativeDriver: true, speed: 40, bounciness: 6 }).start();

  return (
    <Pressable
      {...props}
      style={containerStyle}
      disabled={disabled}
      onPressIn={(event) => { spring(scale, pressedScale); onPressIn?.(event); }}
      onPressOut={(event) => { spring(scale, 1); onPressOut?.(event); }}
      onHoverIn={(event) => { if (Platform.OS === "web") spring(lift, -hoverLift); onHoverIn?.(event); }}
      onHoverOut={(event) => { if (Platform.OS === "web") spring(lift, 0); onHoverOut?.(event); }}
    >
      <Animated.View style={[style, { transform: [{ translateY: lift }, { scale }] }, disabled && { opacity: 0.6 }]}>{children}</Animated.View>
    </Pressable>
  );
}

/** Fades and rises content into place once mounted; stagger siblings with `delay`. */
export function FadeInView({ children, delay = 0, distance = 14, duration = 460, style }: PropsWithChildren<{ delay?: number; distance?: number; duration?: number; style?: StyleProp<ViewStyle> }>) {
  const [progress] = useState(() => new Animated.Value(0));
  useEffect(() => {
    const animation = Animated.timing(progress, { toValue: 1, duration, delay, easing: Easing.out(Easing.cubic), useNativeDriver: true });
    animation.start();
    return () => animation.stop();
  }, [delay, duration, progress]);
  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [distance, 0] });
  return <Animated.View style={[style, { opacity: progress, transform: [{ translateY }] }]}>{children}</Animated.View>;
}

/** Briefly pops its child when `trigger` changes (e.g. a counter tick). */
export function PopOnChange({ trigger, children, style }: PropsWithChildren<{ trigger: unknown; style?: StyleProp<ViewStyle> }>) {
  const [scale] = useState(() => new Animated.Value(1));
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    Animated.sequence([
      Animated.timing(scale, { toValue: 1.12, duration: 90, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 30, bounciness: 10 }),
    ]).start();
  }, [scale, trigger]);
  return <Animated.View style={[style, { transform: [{ scale }] }]}>{children}</Animated.View>;
}
