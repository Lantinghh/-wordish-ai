// components/WordClubPanel.tsx
import { View, StyleSheet, Image, Pressable, Text, ScrollView } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { useEffect, useState } from 'react';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';


export default function WordClubPanel({ visible }: { visible: boolean }) {
  const API_BASE_URL = 'https://croissant-ai-ms-hackthon.vercel.app/api';

  const router = useRouter();

  
  const rotate = useSharedValue('-15deg'); // 初始为 -15°
  const offsetX = useSharedValue(400); // 初始在右边隐藏
  const translateY = useSharedValue(0); // 初始位置
  const translateX = useSharedValue(0); // 初始位置

  useEffect(() => {
    if (visible) {
      rotate.value = withTiming('0deg', { duration: 1000, easing: Easing.out(Easing.exp) });
      offsetX.value = withTiming(4, { duration: 1000, easing: Easing.out(Easing.exp) });
      translateY.value = withTiming(0, { duration: 1000, easing: Easing.out(Easing.exp) }); // 显示时回到原位
      translateX.value = withTiming(0, { duration: 1000, easing: Easing.out(Easing.exp) }); // 显示时回到原位
    } else {
      rotate.value = withTiming('-15deg', { duration: 1000, easing: Easing.out(Easing.exp) });
      offsetX.value = withTiming(400, { duration: 1000, easing: Easing.out(Easing.exp) });
      translateY.value = withTiming(-80, { duration: 1000, easing: Easing.out(Easing.exp) }); // 显示时回到原位
      translateX.value = withTiming(60, { duration: 1000, easing: Easing.out(Easing.exp) }); // 显示时回到原位
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: offsetX.value },
      { rotate: rotate.value },
      { translateY: translateY.value }, // 控制垂直位置
      { translateX: translateX.value }, // 控制水平位置
    ],
  }));
  const courseWords = {
    'SAT Essential': [
      { text: 'Convoluted', status: 'Stranger' },
      { text: 'Spurious', status: 'Stranger' },
      { text: 'Spuriouss', status: 'Stranger' },
    ],
    'ACT Essential': [
      { text: 'Verbose', status: 'Stranger' },
      { text: 'Precocious', status: 'Stranger' },
    ],
    'AP Literature': [
      { text: 'Sonnet', status: 'Stranger' },
      { text: 'Iambic', status: 'Stranger' },
    ],
    'GRE Essential': [
      { text: 'Assuage', status: 'Stranger' },
      { text: 'Capricious', status: 'First Date' },
      { text: 'Convoluted', status: "We've met" },
      { text: 'Dissipated', status: 'Stranger' },
      { text: 'Grandiloquent', status: 'Stranger' },
      { text: 'Imperturbable', status: 'Stranger' },
      { text: 'Inimical', status: 'Stranger' },
      { text: 'Obdurate', status: 'Stranger' },
      { text: 'Pedantic', status: 'Stranger' },
    ],
    'TOFEL Essential': [
      { text: 'Comprehension', status: 'Stranger' },
      { text: 'Articulate', status: 'Stranger' },
    ],
  };

  const [showWordList, setShowWordList] = useState(false);
  const [wordList, setWordList] = useState<{ text: string; status: string }[]>([]);

  const toggleStatus = (index: number) => {
    const statuses = ['Stranger', 'First Date', "We've met", 'A Match'];
    setWordList((prev) => {
      const updated = [...prev];
      const currentStatus = updated[index].status;
      const nextIndex = (statuses.indexOf(currentStatus) + 1) % statuses.length;
      updated[index].status = statuses[nextIndex];
      return updated;
    });
  };

  const handleAddWord = () => {
    setShowWordList(true);
  };

  const handleSelectCourse = (course: keyof typeof courseWords) => {
    const selectedWords = courseWords[course].map(word => ({ ...word })); 
    setWordList(selectedWords); // 注意这里浅拷贝，避免直接改到 courseWords 本体！
    
    setCourseStatus((prev) => ({
      ...prev,
      [course]: 'On going', // 把对应课程状态改成 Ongoing
    }));
  
    setShowWordList(false); // 隐藏课程列表
  };
  

  const [courseStatus, setCourseStatus] = useState<{ [key: string]: string }>(
    Object.keys(courseWords).reduce((acc, course) => {
      acc[course] = 'Start!'; // 初始化所有课程状态为 'Start'
      return acc;
    }, {} as { [key: string]: string })
  );
  const getCourseButtonStyle = (status: string) => {
    if (status === 'Start!') {
      return { button: { borderColor: '#D34646' }, text: { color: '#D34646' } };
    } else if (status === 'On going') {
      return { button: { borderColor: '#FE7C22', }, text: { color: '#FE7C22' } };
    }
    return { button: { borderColor: '#D34646', }, text: { color: '#D34646' } };
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
        <>
          {/* 这是显示课程选择页面 */}
          <View style={styles.wordListContainer}>
            <Pressable style={styles.backButton} onPress={() => setShowWordList(false)}>
              <Image source={require('../../assets/wordpanel/back_button.png')} style={styles.backButtonImage} />
            </Pressable>

            <ScrollView style={styles.listWrapper} contentContainerStyle={{ paddingBottom: 40 }}>
              {Object.keys(courseWords).map((title, idx) => {
                const courseStyles = getCourseButtonStyle(courseStatus[title]);
                return (
                  <View key={idx} style={styles.wordRow}>
                    <Text style={styles.wordText}>{title}</Text>
                    <Pressable
                      style={[styles.startButton, courseStyles.button]}
                      onPress={() => handleSelectCourse(title as keyof typeof courseWords)}
                    >
                      <Text style={[styles.startText, courseStyles.text]}>{courseStatus[title]}</Text>
                    </Pressable>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </>
      )}
    </Animated.View>
  );
}



import { Dimensions } from 'react-native';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');




const styles = StyleSheet.create({
  panel: {
    position: 'absolute', // 确保面板覆盖在其他内容上
    width: screenWidth-7, // 宽度增加 40 像素
    height: screenHeight + 70 , // 高度增加 70 像素
    backgroundColor: 'transparent',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    
  },
  image: {
    width: '100%',
    height: '100%',
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  wordCount: {
    position: 'absolute',
    width: 100,
    height: 21,
    left: 57,
    top: 193,
    fontFamily: 'Figma Hand',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 21, // 150% of font size
    color: '#D34646',
  },
  mainText: {
    position: 'absolute',
    width: 200,
    height: 21,
    left: 57,
    top: 220,
    fontFamily: 'Figma Hand',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 21, // 150% of font size
    color: '#D34646',
  },
  addButton: {
    position: 'absolute',
    bottom: 701,
    right: -22,
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 20,
  },
  addButtonImage: {
    width: 120, // 图像宽度
    height: 24, // 图像高度
    resizeMode: 'contain', // 确保图像按比例缩放
  },
  wordListContainer: {
    position: 'absolute', // 确保覆盖在面板上
    top: -30,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent', // 设置背景色，确保内容可见
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    zIndex: 10, // 确保在其他内容之上
    padding: 0,
  },
  backButton: {
    top: 160,
    left: 40,
    padding: 10,
    backgroundColor: 'transparent', // 设置透明背景
    borderRadius: 8,
  },
  backButtonImage: {
    width: 14, // 图片宽度
    height: 23, // 图片高度
    resizeMode: 'contain', // 确保图片按比例缩放
  },
  listWrapper: {
    position: 'absolute', // 确保覆盖在面板上
    top: 210,
    left: 40,
    width: '90%',
    height: '100%',
    backgroundColor: 'transparent', // 设置背景色，确保内容可见
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    zIndex: 10, // 确保在其他内容之上
    padding: 20,
  },
  wordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 11,
  },
  wordText: {
    fontSize: 18,
    color: '#000',
    fontFamily: 'Figma Hand',
    fontStyle: 'italic',
  },
  startButton: {
    width: 120, // 固定宽度
    height: 40, // 固定高度
    borderWidth: 1,
    borderColor: '#D34646',
    borderRadius: 4,
    justifyContent: 'center', // 垂直居中内容
    alignItems: 'center', // 水平居中内容
  },
  startText: {
    fontSize: 16,
    color: '#D34646',
    fontFamily: 'Figma Hand',
    fontStyle: 'italic',

  },
  statusButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 4,
    backgroundColor: '#FFF8B3',
  },
  statusText: {
    fontSize: 16,
    color: '#FE5A1C',
    fontFamily: 'Figma Hand',
    fontStyle: 'italic',
  },
});