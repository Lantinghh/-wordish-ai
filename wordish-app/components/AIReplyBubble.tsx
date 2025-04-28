import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';

export default function AIReplyBubble({ text }: { text: string }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentWord, setCurrentWord] = useState('');

  const entity = 'serendipity'; // ⚡ 现在先写死（测试），后面动态拿structured output

  const parts = text.split(new RegExp(`(${entity})`, 'gi'));

  const handleWordPress = (word: string) => {
    setCurrentWord(word);
    setModalVisible(true);
  };

  return (
    <View>
      <Text style={styles.text}>
        {parts.map((part, index) => {
          if (part.toLowerCase() === entity.toLowerCase()) {
            return (
              <TouchableOpacity key={index} onPress={() => handleWordPress(part)}>
                <Text style={styles.highlight}>{part}</Text>
              </TouchableOpacity>
            );
          } else {
            return <Text key={index}>{part}</Text>;
          }
        })}
      </Text>

      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{currentWord}</Text>
            <Text style={styles.modalMeaning}>（这里可以调释义）</Text>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  text: { fontSize: 16, lineHeight: 24, 
    color: '#333', // 设置字体颜色
    fontFamily: 'KleeOne-Regular', // 如果有自定义字体
    fontWeight: '400', // 设置字体粗细 
    },
  highlight: { color: '', textDecorationLine: 'underline' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: 250, padding: 20, backgroundColor: '#fff', borderRadius: 8, alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  modalMeaning: { fontSize: 14, color: '#555' },
});
