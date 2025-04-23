// app/welcome/Step2_BlankHold.tsx
import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

export default function Step2_BlankHold() {
  const opacity = useSharedValue(0);
  const router = useRouter();

  useEffect(() => {
    const startFade = setTimeout(() => {
      opacity.value = withTiming(1, { duration: 1000 });
    }, 800);

    const jump = setTimeout(() => {
      router.replace('/welcome/Step3_TextFadeIn');
    }, 1800);

    return () => {
      clearTimeout(startFade);
      clearTimeout(jump);
    };
  }, []);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return <Animated.View style={[styles.container, style]} />;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
});
