import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image } from 'react-native';

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

  const words = text.split(/(\s+|[.,!?'"“”‘’—-])/g).filter(w => w !== undefined && w !== '');

  return (
    <View style={styles.container}>
      <View style={styles.textWrapper}>
        {words.map((word, index) => {
          const highlight = highlights.find(h => h.word.toLowerCase() === word.trim().toLowerCase());

          if (highlight) {
            return (
              <View key={index} style={styles.highlightContainer}>
                <TouchableOpacity
                  onPress={() => setActiveWord(prev => (prev?.word === highlight.word ? null : highlight))}
                  style={styles.highlightTouchable}
                >
                  <Text style={styles.highlightedWord}>{highlight.word}</Text>
                  {/* 在高亮单词旁边加一个小 GIF */}
                  <Image
                    source={require('../assets/gifs/circle.gif')} // 改成你的gif路径
                    style={styles.highlightGif}
                  />
                </TouchableOpacity>
              </View>
            );
          }

          return (
            <Text key={index} style={styles.normalText}>{word}</Text>
          );
        })}
      </View>

      {/* 弹出释义和 meme */}
      <Modal visible={!!activeWord} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setActiveWord(null)}>
          {activeWord && (
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{activeWord.word}</Text>
              <Text style={styles.modalMeaning}>{activeWord.meaning}</Text>
              {activeWord.meme && (
                <Image source={activeWord.meme} style={styles.memeImage} resizeMode="contain" />
              )}
            </View>
          )}
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default MessageWithHighlight;

const styles = StyleSheet.create({
  container: { marginVertical: 8 },
  textWrapper: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start' },
  highlightContainer: { flexDirection: 'row', alignItems: 'center' }, // ⭐ 加个横向容器
  highlightTouchable: { flexDirection: 'row', alignItems: 'center' },
  normalText: {
    fontSize: 16, // 设置字体大小
    color: '#333', // 设置字体颜色
    lineHeight: 24, // 设置行高
    fontFamily: 'KleeOne-Regular', // 如果有自定义字体
    fontWeight: '400', // 设置字体粗细
   },
  highlightedWord: { fontSize: 16, textDecorationLine: 'underline', fontFamily: 'KleeOne-Regular', // 如果有自定义字体
  },
  highlightGif: {
    position: 'absolute', // 让 GIF 浮动
    width: 50, // 调整宽度
    height: 50, // 调整高度
    marginLeft: 0, // 移除与文字的间距
    top: -20, // 调整垂直位置，使其浮在文字上
    left: 0, // 调整水平位置
  },  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: 280, padding: 20, backgroundColor: '#fff', borderRadius: 8, alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  modalMeaning: { fontSize: 14, color: '#555', marginBottom: 12 },
  memeImage: { width: 200, height: 200, marginTop: 8 },
});
