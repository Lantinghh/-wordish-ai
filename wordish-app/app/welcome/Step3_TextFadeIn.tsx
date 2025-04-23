// app/welcome/Step3_TextFadeIn.tsx
import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

export default function Step3_TextFadeIn() {
  const opacity = useSharedValue(0);
  const router = useRouter();

  useEffect(() => {
    const fade = setTimeout(() => {
      opacity.value = withTiming(1, { duration: 1000 });
    }, 0);

    const jump = setTimeout(() => {
      router.replace('/welcome/Step5_SwipeToContinue');
    }, 2200);

    return () => {
      clearTimeout(fade);
      clearTimeout(jump);
    };
  }, []);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View style={[styles.container, style]}>
       <Text style={{ fontFamily: 'KleeOne-Regular', fontSize: 16, lineHeight: 28, color: '#000' }}>    It’s a beautiful{'\n'}Saturday afternoon.</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  text: { fontSize: 20, lineHeight: 28, textAlign: 'center', color: '#333' },
});
