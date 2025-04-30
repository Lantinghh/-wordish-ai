import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TouchableWithoutFeedback } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  useAnimatedGestureHandler
} from 'react-native-reanimated';
import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';

interface HighlightWord {
  word: string;
  meaning: string;
  meme?: any;
}

interface MessageWithHighlightProps {
  text: string;
  highlights: HighlightWord[];
}

const MessageWithHighlight: React.FC<MessageWithHighlightProps> = ({ text, highlights }) => {
  const [activeWord, setActiveWord] = useState<HighlightWord | null>(null);
  const [popupWord, setPopupWord] = useState<HighlightWord | null>(null);
  const [popupIndex, setPopupIndex] = useState<number | null>(null);
  const [removedIndexes, setRemovedIndexes] = useState<number[]>([]);
  const [isDeleteZone, setIsDeleteZone] = useState(false);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  
  const bubbleStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: isDeleteZone ? '45deg' : '0deg' }, // 在删除区域旋转
    ],
    opacity: isDeleteZone ? 0.4 : 1, // 在删除区域变透明
  }));
  const deleteZoneScale = useSharedValue(1); // 初始缩放为 1
  const deleteZoneStyle = useAnimatedStyle(() => ({
    transform: [{ scale: deleteZoneScale.value }], // 根据 deleteZoneScale 动态缩放
  }));
  const gestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
  
      // 检查是否拖动到左下角
      const isInTrash = event.translationX < -50 && event.translationY > 50;
      runOnJS(setIsDeleteZone)(isInTrash);
  
      // 动态调整 deleteZone 的缩放
      deleteZoneScale.value = isInTrash ? 2 : 1; // 放大到 1.5 倍
    },
    onEnd: () => {
      
      if (isDeleteZone && popupIndex !== null) {
        // 触发删除逻辑
        // runOnJS(deleteWordFromBackend)(popupWord!.word);
        runOnJS(setRemovedIndexes)([...removedIndexes, popupIndex!]);
        runOnJS(setPopupWord)(null);
        runOnJS(setPopupIndex)(null);
        runOnJS(setIsDeleteZone)(false);
      } else {
          // 隐藏 bubble
        runOnJS(setPopupWord)(null);
        runOnJS(setPopupIndex)(null);

        // 恢复初始位置
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);

        // 重置删除区域状态
        deleteZoneScale.value = 1;
        runOnJS(setIsDeleteZone)(false);
            
      }
  
      // 恢复 deleteZone 的缩放
      deleteZoneScale.value = 1;
    },
  });

  const words = text.split(/(\s+|[.,!?'"“”‘’—-])/g).filter(w => w !== undefined && w !== '');

  const deleteWordFromBackend = async (word: string) => {
    try {
      const response = await fetch('https://your-backend-api.com/delete-word', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ word }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete word from backend');
      }
  
      console.log('Word deleted successfully from backend:', word);
    } catch (error) {
      console.error('Error deleting word from backend:', error);
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.textWrapper}>
        {words.map((word, index) => {
          // if (removedIndexes.includes(index)) return null;
          
          const highlight = highlights.find(h => h.word.toLowerCase() === word.trim().toLowerCase());
          const isRemoved = removedIndexes.includes(index);

          if (highlight && !isRemoved) {
            return (
              <PanGestureHandler key={`highlight-${index}`} onGestureEvent={gestureHandler}>
                <Animated.View>
                  <TouchableOpacity
                    onPress={() => {
                      if (!popupWord) {
                        setActiveWord(prev => prev?.word === highlight.word ? null : highlight);
                      }
                    }}
                    onLongPress={() => {
                      setPopupWord(highlight);
                      setPopupIndex(index);
                      translateX.value = 0; // 初始化拖动位置
                      translateY.value = 0;
                    }}
       
                    delayLongPress={300}
                    style={styles.highlightTouchable}
                  >
                    <Text style={styles.highlightedWord}>{highlight.word}</Text>
                    <Image source={require('../assets/gifs/circle.gif')} style={styles.highlightGif} />
                  </TouchableOpacity>
                </Animated.View>
              </PanGestureHandler>
            );
          }
    // 默认文本（普通词 or 被移除高亮的词）

          return (
            <Text key={`normal-${index}`} style={styles.normalText}>{word}</Text>
          );
        })}
      </View>

      {popupWord && popupIndex !== null && (
        <TouchableWithoutFeedback
          onPress={() => {
            // 点击隐藏 bubble
            setPopupWord(null);
            setPopupIndex(null);
          }}
        >
          <View>
            <PanGestureHandler onGestureEvent={gestureHandler}>
              <Animated.View style={[styles.popupBubble, bubbleStyle]}>
                <Text style={styles.popupWord}>{popupWord.word}</Text>
                <Text style={styles.popupMeaning}>{popupWord.meaning}</Text>
              </Animated.View>
            </PanGestureHandler>
            <View style={styles.deleteZone}>
                <Animated.View style={[styles.deleteZone, deleteZoneStyle]}>
                  <Image source={require('../assets/delete.png')} style={{ width: 40, height: 40 }} />
                </Animated.View>
              </View>
          </View>
        </TouchableWithoutFeedback>
      )}
      {activeWord && (
        <View style={styles.inlineMeaningFloating}>
          <Text style={styles.inlineMeaningText}>{activeWord.meaning}</Text>
        </View>
      )}
      
    </GestureHandlerRootView>
  );
};

export default MessageWithHighlight;

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    position: 'relative',
  },
  textWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  highlightTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  highlightedWord: {
    fontSize: 16,
    textDecorationLine: 'underline',
    fontFamily: 'KleeOne-Regular',
  },
  highlightGif: {
    position: 'absolute',
    width: 50,
    height: 50,
    marginLeft: 0,
    top: -20,
    left: 0,
  },
  inlineMeaningFloating: {
    position: 'absolute',
    top: '15%',
    left: -5,
    right: -5,
    backgroundColor: '#CEEAFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    zIndex: 999,
    alignSelf: 'center',
  },
  inlineMeaningText: {
    fontSize: 14,
    color: '#197AC0',
    fontFamily: 'KleeOne-Regular',
  },
  normalText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    fontFamily: 'KleeOne-Regular',
  },
  popupBubble: {
    position: 'absolute',
    bottom: 150,
    left: 30,
    width: 200,
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#D9EDFF',
    borderRadius: 20,
    zIndex: 100,
    maxWidth: 260,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  deleteZone: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  popupWord: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#197AC0',
    fontFamily: 'KleeOne-Regular',
    textAlign: 'center',
  },
  popupMeaning: {
    fontSize: 14,
    color: '#197AC0',
    fontFamily: 'KleeOne-Regular',
    textAlign: 'center',
    marginTop: 4,
  },

});
