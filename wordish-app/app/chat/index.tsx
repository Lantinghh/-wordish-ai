// app/chat/index.tsx
import { useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import WordClubPanel from '../components/WordClubPanel';
import { useRouter } from 'expo-router'; // 👈 一定要import！
import MessageWithHighlight from '@/components/MessageWithHighlight';

export default function ChatMainPage() {  
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: "Met a girl. Crashed into her. Didn’t get sued. 10/10 would do again 😉",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: 'croissant',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isWordClubVisible, setWordClubVisible] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // const handleSend = async () => {
  //   if (!inputText.trim()) return;
  //   const now = Date.now();
  //   const userMessage = {
  //     id: now.toString(),
  //     text: inputText,
  //     time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  //     sender: 'me',
  //   };

  //   setMessages((prev) => [...prev, userMessage]);
  //   setInputText('');
  
  //   const loadingMessage = {
  //     id: (now + 1).toString(),
  //     text: '',
  //     time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  //     sender: 'loading',
  //   };
  
  //   setMessages((prev) => [...prev, loadingMessage]);
  //   const startTime = Date.now();
  
  //   try {
  //     const response = await fetch('https://croissant-ai-ms-hackthon.vercel.app/api/chat', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Accept': 'text/plain',
  //       },
  //       body: JSON.stringify({
  //         messages: [
  //           {
  //             role: 'user',
  //             content: userMessage.text,
  //           }
  //         ]
  //       }),
  //     });
  
  //     const aiReply = await response.text();
  //     const elapsed = Date.now() - startTime;
  //     const minimumLoadingTime = 2000; // ⭐ 这里调整，比如 800ms，1000ms，看你想要多久
  //     const delay = Math.max(minimumLoadingTime - elapsed, 0);
  
  //     setTimeout(() => {
  //       const aiMessage = {
  //         id: loadingMessage.id,
  //         text: aiReply,
  //         time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  //         sender: 'croissant',
  //       };
  
  //       setMessages((prev) =>
  //         prev.map((msg) => (msg.id === loadingMessage.id ? aiMessage : msg))
  //       );
  
  //       setTimeout(() => {
  //         flatListRef.current?.scrollToEnd({ animated: true });
  //       }, 100);
  
  //     }, delay);

  //   } catch (error) {
  //     console.error('发送到AI失败:', error);
  //   }
  // };
  const handleSend = async () => {
    if (!inputText.trim()) return;
    const now = Date.now();
    const userMessage = {
      id: now.toString(),
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: 'me',
    };
  
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
  
    const loadingMessage = {
      id: (now + 1).toString(),
      text: '',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: 'loading',
    };
  
    setMessages((prev) => [...prev, loadingMessage]);
    const startTime = Date.now();
  
    try {
      const response = await fetch('https://croissant-ai-ms-hackthon.vercel.app/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: userMessage.text,
            }
          ]
        }),
      });
  
      const aiReply = await response.json(); // 解析 JSON 数据
      console.log('AI 回复:', aiReply);
      const elapsed = Date.now() - startTime;
      const minimumLoadingTime = 2000;
      const delay = Math.max(minimumLoadingTime - elapsed, 0);
  
      setTimeout(() => {
        const aiMessage = {
          id: loadingMessage.id,
          text: aiReply.txt_msg, // 提取文本消息
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sender: 'croissant',
          highlights: aiReply.tofelWords?.map((word: { word: any; explanation: any; }) => ({
            word: word.word,
            meaning: word.explanation,
          })) || [], // 提取高亮单词
                  };
        console.log('AI 消息:', aiMessage);
        setMessages((prev) =>
          prev.map((msg) => (msg.id === loadingMessage.id ? aiMessage : msg))
        );
  
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
  
      }, delay);
  
    } catch (error) {
      console.error('发送到AI失败:', error);
    }
  };

  const router = useRouter(); // 👈 创建router实例

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/profile')}>
            <Image source={require('../../assets/home_images/menu.png')} style={styles.menuIcon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chat</Text>
          <Text style={styles.username}>Norman_SpicyCroissant</Text>
        </View>

        {/* Right edge transparent sidebar button */}
        <TouchableOpacity
          style={styles.transparentSidebarButton}
          onPress={() => setWordClubVisible((prev) => !prev)}
        />

        <FlatList 
          ref={flatListRef}
          data={messages}
          ListHeaderComponent={
            <View style={styles.profileSection}>
              <Image source={require('../../assets/home_images/croissant.png')} style={styles.mainAvatar} />
              <Text style={styles.name}>Norman_SpicyCroissant</Text>
              <Text style={styles.subtext}>You’re friends on Wordish</Text>
              <Image source={require('../../assets/home_images/friends.png')} style={styles.friendIcon} />
              <Text style={styles.hint}>Say hi to your new Wordish friend, Norman.</Text>
            </View>
          }
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 100 }}

          renderItem={({ item }) => (
            <View>
              {item.sender !== 'loading' && (
                <Text style={styles.timestamp}>{item.time}</Text>
              )}
              <View style={[styles.messageRow, item.sender === 'me' && { flexDirection: 'row-reverse' }]}>
                <Image
                  source={
                    item.sender === 'me'
                      ? require('../../assets/home_images/my_avatar.png')
                      : require('../../assets/home_images/ai_avatar.png')
                  }
                  style={styles.bubbleAvatar}
                />
                {item.sender === 'loading' ? (
                  <Image source={require('../../assets/home_images/loading_dots.gif')} style={{ width: 50, height: 30 }} />
                ) : (
                  <View style={[styles.bubble, item.sender === 'me' && { backgroundColor: '#DCF8C6' }]}>
                    {item.sender === 'croissant' ? (
                      <MessageWithHighlight 
                        text={item.text}
                        highlights={item.highlights || []} // ✅ 自动查单词
                      />
                    ) : (
                      <Text style={styles.messageText}>{item.text}</Text>
                    )}
                  </View>
                )}
              </View>
            </View>
          )}   
        />
        <View style={[styles.inputBar, { bottom: insets.bottom }]}>
          <TouchableOpacity>
            <Image source={require('../../assets/home_images/input_bar/picture_icon.png')} style={styles.sideIcon} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={require('../../assets/home_images/input_bar/audio_icon.png')} style={styles.sideIcon} />
          </TouchableOpacity>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Aa"
              placeholderTextColor="#999"
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={handleSend}
              returnKeyType="send"
            />
            <TouchableOpacity style={styles.emojiIconWrap} onPress={handleSend}>
              <Image source={require('../../assets/home_images/input_bar/emoji_icon.png')} style={styles.emojiIcon} />
            </TouchableOpacity>
          </View>
        </View>

        {/* WordClubPanel */}
        <WordClubPanel visible={isWordClubVisible} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16, position: 'relative' },
  header: { alignItems: 'center', marginBottom: 12 },
  menuIcon: { position: 'absolute', left: -180, top:8 , width: 24, height: 24 },
  headerTitle: { fontSize: 18, fontWeight: '600', marginTop: 0 },
  username: { fontSize: 12, color: '#888' },

  transparentSidebarButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 40,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 200,
    backgroundColor: 'transparent',
  },

  profileSection: { alignItems: 'center', marginTop: 20, marginBottom: 20 },
  mainAvatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 8 },
  name: { fontSize: 24, fontWeight: 'bold' },
  subtext: { color: '#666', fontSize: 14, marginBottom: 10 },
  friendIcon: { width: 80, height: 60, resizeMode: 'contain', marginTop: 12, marginBottom: 6 },
  hint: { fontSize: 12, color: '#999' },

  timestamp: { textAlign: 'center', fontSize: 12, color: '#ccc', marginTop: 20, marginBottom: 8 },
  messageRow: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 8 },
  bubbleAvatar: { width: 36, height: 36, borderRadius: 18, marginRight: 8, marginLeft: 8 },
  bubble: { backgroundColor: '#F1F1F1', borderRadius: 16, padding: 10, maxWidth: '75%' },
  messageText: {
    fontSize: 16, // 设置字体大小
    color: '#333', // 设置字体颜色
    lineHeight: 24, // 设置行高
    fontFamily: 'KleeOne-Regular', // 如果有自定义字体
    fontWeight: '400', // 设置字体粗细
  },

  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 0,
    backgroundColor: '#fff',
  },
  

  sideIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
    resizeMode: 'contain',
  },

  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 24,
    paddingHorizontal: 12,
  },

  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    
  },

  emojiIconWrap: {
    marginLeft: 8,
  },

  emojiIcon: {
    width: 24,
    height: 24,
  },
});
