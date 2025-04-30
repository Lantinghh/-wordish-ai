// components/WordClubPanel.tsx
import { View, StyleSheet, Image, Pressable, Text, ScrollView } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { useEffect, useState } from 'react';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';


export default function WordClubPanel({ visible }: { visible: boolean }) {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    'Handlee-Regular': require('../../assets/fonts/Handlee-Regular.ttf'), // 确保路径正确
  });

  if (!fontsLoaded) {
    return null; // 在字体加载完成之前不渲染组件
  }

  
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
   'TOFEL Essential': [
  { text: 'Accumulate', status: 'A Match' },
  { text: 'Assess', status: "We've met" },
  { text: 'Consequently', status: 'A Match' },
  { text: 'Contribute', status: 'First Date' },
  { text: 'Expose', status: 'Stranger' },
  { text: 'Mature', status: 'Stranger' },
  { text: 'Precise', status: 'Stranger' },
  { text: 'Reinforce', status: 'Stranger' },
  { text: 'Significant', status: 'Stranger' },
  { text: 'Viable', status: 'Stranger' },
],

  };

  const [showWordList, setShowWordList] = useState(false);
  const [wordList, setWordList] = useState<{ text: string; status: string }[]>([]);
  // const [courseWords, setCourseWords ] = useState<{
  //   [key: string]: { text: string; status: string; id: string }[];
  // }>({
  //   'SAT Essential': [],
  //   'ACT Essential': [],
  //   'AP Literature': [],
  //   'GRE Essential': [],
  //   'TOFEL Essential': [],
  // });
  // const handleAddWord = async () => {
  //   try {
  //     const res = await fetch(`${API_BASE_URL}/vocabulary`);
  //     const data = await res.json();
  //     console.log('📥 后端返回词表:', data);
  
  //     const grouped: { [category: string]: { text: string; status: string; id: string }[] } = {};
  
  //     data.forEach((item: any) => {
  //       const category = item.category || 'Uncategorized';
  //       const status = item.states?.[0]?.status || 'Stranger';
  
  //       if (!grouped[category]) {
  //         grouped[category] = [];
  //       }
  
  //       grouped[category].push({
  //         text: item.word,
  //         status,
  //         id: item.id,
  //       });
  //     });
  
  //     // 替换本地课程数据
  //     setCourseWords(grouped);
  
  //     // 初始化课程状态为 "Start!"
  //     const initStatus: { [key: string]: string } = {};
  //     Object.keys(grouped).forEach((c) => (initStatus[c] = 'Start!'));
  //     setCourseStatus(initStatus);
  
  //     setShowWordList(true);
  //   } catch (error) {
  //     console.error('❌ 获取词汇失败:', error);
  //   }
  // };
  

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

  const [selectedWord, setSelectedWord] = useState<{ text: string; status: string } | null>(null);
  const memeMap: { [word: string]: { [stage: string]: any } } = {
    Accumulate: {
      "We've met": require('../../assets/memes/TOFEL/Accumulate.jpg'),
      "A Match": require('../../assets/memes/TOFEL/Accumulate2.jpg'),
    },
    Assess: {
      "We've met": require('../../assets/memes/TOFEL/Assess.jpg'),
      "A Match": require('../../assets/memes/TOFEL/Assess2.jpg'),
    },
    Consequently: {
      "We've met": require('../../assets/memes/TOFEL/Consequently.jpg'),
      "A Match": require('../../assets/memes/TOFEL/Consequently 2.jpg'),
    },
    Contribute: {
      "We've met": require('../../assets/memes/TOFEL/Contribute.jpg'),
      "A Match": require('../../assets/memes/TOFEL/Contribute2.jpg'),
    },
    Expose: {
      "We've met": require('../../assets/memes/TOFEL/Expose.jpg'),
      "A Match": require('../../assets/memes/TOFEL/Expose2.jpg'),
    },
    Mature: {
      "We've met": require('../../assets/memes/TOFEL/Mature.jpeg'),
      "A Match": require('../../assets/memes/TOFEL/Mature 2.jpg'),
    },
    Precise: {
      "We've met": require('../../assets/memes/TOFEL/Precise.jpg'),
      "A Match": require('../../assets/memes/TOFEL/Precise2.png'),
    },
    Reinforce: {
      "We've met": require('../../assets/memes/TOFEL/Reinforce.jpg'),
      "A Match": require('../../assets/memes/TOFEL/Reinforce 2.jpg'),
    },
    Significant: {
      "We've met": require('../../assets/memes/TOFEL/Significant.jpg'),
      "A Match": require('../../assets/memes/TOFEL/Significant 2.jpg'),
    },
    Viable: {
      "A Match": require('../../assets/memes/TOFEL/Viable 2.jpg'), // 注意你只有 A Match 图
    },
  };
  
  const STAGES = ['Stranger', 'First Date', "We've met", 'A Match'] as const;

  const renderStageContent = (stage: string, selectedWord: { text: string; status: string }) => {
    const getStatusStyle = (status: string) => {
      switch (status) {
        case 'Stranger': return { backgroundColor: '#F3F5A9', color: '#FE5A1C' };
        case 'First Date': return { backgroundColor: '#FFE134', color: '#FE5A1C' };
        case "We've met": return { backgroundColor: '#FFBF2E', color: '#FE5A1C' };
        case 'A Match': return { backgroundColor: '#FE7C22', color: '#FFFFFF' };
        default: return { backgroundColor: '#F3F5A9', color: '#FE5A1C' };
      }
    };
  
    const statusStyle = getStatusStyle(stage);
  
    switch (stage) {
      case 'Stranger':
        return (
          <>
            <Text style={[styles.statusButton1, { backgroundColor: statusStyle.backgroundColor, color: statusStyle.color }]}>
              Stranger
            </Text>
            <Text style={styles.detailContent}>
              You haven't interacted with <Text style={{ color: '#0275d8', fontWeight: 'bold' }}>{selectedWord.text}</Text> yet.
            </Text>
          </>
        );
  
      case 'First Date':
        return (
          <>
            <Text style={[styles.statusButton1, { backgroundColor: statusStyle.backgroundColor, color: statusStyle.color }]}>
              First Date
            </Text>
            <Text style={styles.detailContent}>
              Uh-huh. That’s the most <Text style={{ color: '#0275d8', fontWeight: 'bold' }}>{selectedWord.text}</Text> way I’ve ever seen
              someone try to run into me “by chance.”
            </Text>
          </>
        );
  
      case "We've met":
      case 'A Match':
        return (
          <>
            <Text style={[styles.statusButton1, { backgroundColor: statusStyle.backgroundColor, color: statusStyle.color }]}>
              {stage}
            </Text>
            {memeMap[selectedWord.text]?.[stage] ? (
              <Image
                source={memeMap[selectedWord.text][stage]}
                style={styles.memeImage}
              />
            ) : (
              <Text style={styles.detailContent}>No meme found for this stage.</Text>
            )}
          </>
        );
  
      default:
        return null;
    }
  };
  
  return (
        <Animated.View style={[styles.panel, animatedStyle]} pointerEvents="box-none">
          <Image source={require('../../assets/home_images/notebook/word_club_bg.png')} style={styles.image} />
        {/* ✅ 插入 detail 卡片（置顶） */}
        {selectedWord && (
      <View style={styles.detailCard}>
        <Image
        source={require('../../assets/memes/notebook.png')}
        style={styles.detailCardBg}
        resizeMode="contain"
      />
        <Pressable onPress={() => setSelectedWord(null)} style={styles.closeDetailButton}>
          <Image
            source={require('../../assets/wordpanel/back_button.png')}  // 根据你的实际路径修改
            style={{ width: 24, height: 24 }} // 设置图片大小
            resizeMode="contain" // 确保图片按比例缩放
         />
        </Pressable>

        <Text style={styles.detailTitle}>{selectedWord.text}</Text>

        {/* 渲染当前状态及之前的内容 */}
        {STAGES.slice(1, STAGES.indexOf(selectedWord.status as typeof STAGES[number]) + 1).map(stage => (
        <View key={stage}>{renderStageContent(stage, selectedWord)}</View>
      ))}
      </View>
    )}

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
                    onPress={() => setSelectedWord(word)}
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
    fontFamily: 'Handlee-Regular',
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
    fontFamily: 'Handlee-Regular',
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
    top: 209 ,
    left: 40,
    width: '87%',
    height: '100%',
    backgroundColor: 'transparent', // 设置背景色，确保内容可见
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    zIndex: 10, // 确保在其他内容之上
    padding: 15,
  },
  wordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 11.5,
  },
  wordText: {
    fontSize: 18,
    color: '#000',
    fontFamily: 'Handlee-Regular',
    fontStyle: 'italic',
  },
  startButton: {
    width: 140, // 固定宽度
    height: 25, // 固定高度
    borderWidth: 1,
    borderColor: '#D34646',
    borderRadius: 4,
    justifyContent: 'center', // 垂直居中内容
    alignItems: 'center', // 水平居中内容
  },
  startText: {
    fontSize: 16,
    color: '#D34646',
    fontFamily: 'Handlee-Regular',
    fontStyle: 'italic',

  },
  statusButton: {
    width: 120, // 固定宽度
    height: 23, // 固定高度
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 4,
    backgroundColor: '#FFF8B3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    fontSize: 16,
    color: '#FE5A1C',
    fontFamily: 'Handlee-Regular',
    fontStyle: 'italic',
  },
  detailCard: {
    position: 'absolute',
    width: screenWidth-7, // 宽度增加 40 像素
    height: screenHeight + 70 , // 高度增加 70 像素
    top: 105,
    left: 0,
    right: 40,
    padding: 16,
    backgroundColor: 'transparent',
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 20,
  },
  detailCardBg: {
    position: 'absolute',
    width: screenWidth-7, // 宽度增加 40 像素
    height: screenHeight, // 高度增加 70 像素
    top:-70,
    left: 0,
    opacity: 1, // 视情况调整透明度
    zIndex: 0,
  },  
  detailTitle: {
    top:0,
    left: screenWidth/3,
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: -5,
    fontFamily: 'Handlee-Regular',
  },
  detailContent: {
    left: 20,
    fontSize: 16,
    fontFamily: 'Handlee-Regular',
    fontStyle: 'italic',
  },
  closeDetailButton: {
    left: 20,
    marginTop: 18,
    alignSelf: 'flex-start',
    width: 10, // 固定宽度
    height: 10, // 固定高度
  },
  memeImage: {
    
    width: '100%', // Adjust the width as needed
    height: 200, // Adjust the height as needed
    resizeMode: 'contain', // Ensures the image scales proportionally
    marginVertical: 10, // Optional: Adds vertical spacing
  },
  statusButton1: {
    left: 20,
    width: 100, // 固定宽度
    height: 23, // 固定高度

    fontFamily: 'Handlee-Regular',
    fontSize: 16,
    fontStyle: 'italic',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginTop: 10,
    marginBottom: 10,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',         // ✅ 让文字居中
  },
  
});