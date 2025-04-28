// app/_layout.tsx
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import { useEffect } from 'react';

export default function Layout() {
  const [fontsLoaded] = useFonts({
    'KleeOne-Regular': require('../assets/fonts/Klee_One/KleeOne-Regular.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return <Stack
  screenOptions={{
    headerShown: false,
    // animation: 'none', // 🚫 禁用页面间切换动画
    animation: 'slide_from_left', // ✅ 这里改成右滑动
    gestureEnabled: true,          // ✅ 支持手势左滑返回
  }}
/>;
}
