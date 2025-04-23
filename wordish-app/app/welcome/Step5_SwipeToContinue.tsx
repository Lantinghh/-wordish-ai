// ✅ Step 5 页面：组件滑入动画
// app/welcome/Step5_SwipeToContinue.tsx
import { View, Text, StyleSheet, Image, PanResponder } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function Step5_SwipeToContinue() {
  const router = useRouter();

  const offsetY = useSharedValue(100);

  useEffect(() => {
    offsetY.value = withTiming(0, { duration: 1600, easing: Easing.out(Easing.exp) });
  }, []);

  const slideInStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: offsetY.value }],
  }));

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gesture) => gesture.dy < -20,
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dy < -50) router.replace('/');
    },
  });

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {/* ✅ 中间固定文字，不参与动画 */}
      <Text style={styles.text}>It’s a beautiful{'\n'}Saturday afternoon.</Text>

      {/* ✅ 动画滑入的三个组件 */}
      <Animated.View style={[styles.circle, slideInStyle]}>
        <Image source={require('../../assets/gifs/circle.gif')} style={styles.circleImage} />
      </Animated.View>

      <Animated.View style={[styles.arrow, slideInStyle]}>
        <Image source={require('../../assets/gifs/arrow.gif')} style={styles.arrowImage} />
      </Animated.View>

      <Animated.View style={[styles.bottomButton, slideInStyle]}>
        <Text style={styles.bottomText}>Swipe up to continue</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
  },
  text: {
    fontFamily: 'KleeOne-Regular',
    fontSize: 16,
    lineHeight: 28,
    textAlign: 'center',
    color: '#000',
    position: 'absolute',
    top: 397,
    width: '100%',
    textAlignVertical: 'center',
  },
  circle: {
    position: 'absolute',
    width: 100,
    height: 100,
    left: 145,
    top: 513,
    opacity: 0.5,
  },
  circleImage: {
    width: '100%',
    height: '100%',
  },
  arrow: {
    position: 'absolute',
    width: 78,
    height: 78,
    left: 156,
    top: 463,
  },  
  arrowImage: {
    width: '100%',
    height: '100%',
    transform: [{ rotate: '-180deg' }],

  },
  bottomButton: {
    position: 'absolute',
    width: 288,
    height: 41,
    left: 52,
    top: 754,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomText: {
    fontSize: 14,
    color: '#999',
    fontFamily: 'KleeOne-Regular',
  },
});
