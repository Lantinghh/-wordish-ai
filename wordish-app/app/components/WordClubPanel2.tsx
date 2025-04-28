// ✅ WordClubPanel.tsx
"use client";

import { View, StyleSheet, Image, Pressable, Text, ScrollView } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { useEffect, useState } from 'react';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';

export default function WordClubPanel({ visible }: { visible: boolean }) {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    'Figma Hand': require('../../assets/fonts/Caveat_Handlee/Handlee/Handlee-Regular.ttf'),
  });

  const rotate = useSharedValue('-15deg');
  const offsetX = useSharedValue(400);
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      rotate.value = withTiming('0deg', { duration: 1000, easing: Easing.out(Easing.exp) });
      offsetX.value = withTiming(4, { duration: 1000, easing: Easing.out(Easing.exp) });
      translateY.value = withTiming(0, { duration: 1000, easing: Easing.out(Easing.exp) });
      translateX.value = withTiming(0, { duration: 1000, easing: Easing.out(Easing.exp) });
    } else {
      rotate.value = withTiming('-15deg', { duration: 1000, easing: Easing.out(Easing.exp) });
      offsetX.value = withTiming(400, { duration: 1000, easing: Easing.out(Easing.exp) });
      translateY.value = withTiming(-80, { duration: 1000, easing: Easing.out(Easing.exp) });
      translateX.value = withTiming(60, { duration: 1000, easing: Easing.out(Easing.exp) });
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: offsetX.value },
      { rotate: rotate.value },
      { translateY: translateY.value },
      { translateX: translateX.value },
    ],
  }));

  const courseWords = {
    'GRE Essential': [
      { text: 'Assuage', status: 'Stranger' },
      { text: 'Capricious', status: 'First Date' },
      { text: 'Convoluted', status: "We've met" },
      { text: 'Dissipated', status: 'A Match' },
    ],
  };

  const [showWordList, setShowWordList] = useState(false);
  const [wordList, setWordList] = useState<{ text: string; status: string }[]>([]);

  const [courseStatus, setCourseStatus] = useState<{ [key: string]: string }>(
    Object.keys(courseWords).reduce((acc, course) => {
      acc[course] = 'Start!';
      return acc;
    }, {} as { [key: string]: string })
  );

  const handleSelectCourse = (course: keyof typeof courseWords) => {
    const selectedWords = courseWords[course].map(word => ({ ...word }));
    setWordList(selectedWords);
    setCourseStatus(prev => ({ ...prev, [course]: 'Ongoing' }));
    setShowWordList(false);
  };

  const getCourseButtonStyle = (status: string) => {
    if (status === 'Start!') {
      return { borderColor: '#D34646', textColor: '#D34646', bgColor: 'white' };
    } else {
      return { borderColor: '#FE7C22', textColor: '#FE7C22', bgColor: 'white' };
    }
  };

  const handleAddWord = () => {
    setShowWordList(true);
  };

  return (
    <Animated.View style={[styles.panel, animatedStyle]} pointerEvents="box-none">
      <Image source={require('../../assets/home_images/notebook/word_club_bg.png')} style={styles.image} />
      {!showWordList ? (
        <>
          {/* 这是显示单词状态页面 */}
          <Text style={styles.wordCount}>Word Count: {wordList.length}</Text>
          <Pressable style={styles.addButton} onPress={handleAddWord}>
            <Image source={require('../../assets/wordpanel/add_button.png')} style={styles.addButtonImage} />
          </Pressable>

          {wordList.length > 0 && (
            <ScrollView style={styles.listWrapper} contentContainerStyle={{ paddingBottom: 40 }}>
              {wordList.map((word, idx) => {
                const getStatusStyle = (status: string) => {
                  switch (status) {
                    case 'Stranger': return { backgroundColor: '#F3F5A9', color: '#FE5A1C' };
                    case 'First Date': return { backgroundColor: '#FFE134', color: '#FE5A1C' };
                    case "We've met": return { backgroundColor: '#FFBF2E', color: '#FE5A1C' };
                    case 'A Match': return { backgroundColor: '#FE7C22', color: '#FFFFFF' };
                    default: return { backgroundColor: '#F3F5A9', color: '#FE5A1C' };
                  }
                };
                const statusStyle = getStatusStyle(word.status);

                return (
                  <View key={idx} style={styles.wordRow}>
                    <Text style={styles.wordText}>{word.text}</Text>
                    <Pressable
                      style={[styles.statusButton, { backgroundColor: statusStyle.backgroundColor }]}
                      onPress={() => router.push(`/wordDetail?word=${encodeURIComponent(word.text)}`)}
                      >
                      <Text style={[styles.statusText, { color: statusStyle.color }]}>{word.status}</Text>
                    </Pressable>
                  </View>
                );
              })}
            </ScrollView>
          )}
        </>
      ) : (
        <View style={styles.wordListContainer}>
          <ScrollView style={styles.listWrapper} contentContainerStyle={{ paddingBottom: 40 }}>
            {Object.keys(courseWords).map((title, idx) => {
              const { borderColor, textColor } = getCourseButtonStyle(courseStatus[title]);
              return (
                <View key={idx} style={styles.wordRow}>
                  <Text style={styles.wordText}>{title}</Text>
                  <Pressable
                    style={[styles.startButton, { borderColor }]}
                    onPress={() => handleSelectCourse(title as keyof typeof courseWords)}
                  >
                    <Text style={[styles.startText, { color: textColor }]}>{courseStatus[title]}</Text>
                  </Pressable>
                </View>
              );
            })}
          </ScrollView>
        </View>
      )}
    </Animated.View>
  );
}

import { Dimensions } from 'react-native';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
  panel: { position: 'absolute', width: screenWidth - 7, height: screenHeight + 70, backgroundColor: 'transparent' },
  image: { width: '100%', height: '100%', alignSelf: 'center', resizeMode: 'contain' },
  wordCount: { position: 'absolute', left: 57, top: 193, fontFamily: 'Figma Hand', fontSize: 14, color: '#D34646' },
  addButton: { position: 'absolute', bottom: 701, right: -22, paddingVertical: 10, paddingHorizontal: 50 },
  addButtonImage: { width: 120, height: 24, resizeMode: 'contain' },
  wordListContainer: { position: 'absolute', top: -30, left: 0, width: '100%', height: '100%', padding: 0 },
  listWrapper: { position: 'absolute', top: 210, left: 40, width: '90%', height: '100%', padding: 20 },
  wordRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 11 },
  wordText: { fontSize: 18, color: '#000', fontFamily: 'Figma Hand', fontStyle: 'italic' },
  startButton: { width: 120, height: 40, borderWidth: 1, borderRadius: 4, justifyContent: 'center', alignItems: 'center' },
  startText: { fontSize: 16, fontFamily: 'Figma Hand', fontStyle: 'italic' },
  statusButton: { paddingVertical: 4, paddingHorizontal: 12, borderRadius: 4, backgroundColor: '#FFF8B3' },
  statusText: { fontSize: 16, fontFamily: 'Figma Hand', fontStyle: 'italic', color: '#FE5A1C' },
});
