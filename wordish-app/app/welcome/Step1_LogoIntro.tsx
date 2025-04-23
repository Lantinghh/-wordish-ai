import { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

export default function Step1_LogoIntro() {
  const opacity = useSharedValue(1);
  const router = useRouter();

  useEffect(() => {
    const delay = setTimeout(() => {
      // 🔹 先执行动画（不绑定 callback）
      opacity.value = withTiming(0, { duration: 1000 });

      // 🔹 再用 setTimeout 执行跳转（更安全）
      setTimeout(() => {
        router.replace('/welcome/Step2_BlankHold');
      }, 1000);
    }, 3000);
    return () => clearTimeout(delay);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
      <Text style={{ fontFamily: 'KleeOne-Regular', fontSize: 16, lineHeight: 28, color: '#000' }}>No Study, Just Vibing</Text>
      <Text style={{ fontFamily: 'KleeOne-Regular', fontSize: 16, lineHeight: 28, color: '#000' }}>A dish of words with a flaky croissant ;)</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  logo: { width: 200, height: 200, resizeMode: 'contain', marginBottom: 24 },
});
