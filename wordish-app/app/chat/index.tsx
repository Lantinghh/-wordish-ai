// app/chat/index.tsx
import { useState, useRef, useEffect } from 'react';
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
  // useEffect(() => {
  //   const ws = new WebSocket('wss://croissant-ai-ms-hackthon.vercel.app/api/chat');
  
  //   ws.onopen = () => {
  //     console.log('✅ WebSocket connected');
  //     // 可以发送身份认证信息，例如：ws.send(JSON.stringify({ type: 'auth', token: '...' }))
  //   };
  
  //   ws.onmessage = (event) => {
  //     const data = JSON.parse(event.data);
  //     console.log('📨 New message:', data);
  
  //     // 把 data 转成新的消息并更新 UI
  //     setMessages((prev) => [
  //       ...prev,
  //       {
  //         id: Date.now().toString(),
  //         text: data.txt_msg,
  //         time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  //         sender: 'croissant',
  //         highlights: data.tofelWords || [],
  //       },
  //     ]);
  //   };
  
  //   ws.onerror = (err) => {
  //     console.error('❌ WebSocket error:', err);
  //   };
  
  //   ws.onclose = () => {
  //     console.warn('⚠️ WebSocket closed');
  //   };
  
  //   return () => {
  //     ws.close();
  //   };
  // }, []);



  useEffect(() => {
    const startConversation = async () => {
      try {
        const response = await fetch('https://croissant-ai-ms-hackthon.vercel.app/api/chat', {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: '550e8400-e29b-41d4-a716-446655440000',
            messages: [
              {
                role: 'assistant',
                content: 'START_CONVERSATION',
                conversation_id: 'abcscao',
              },
            ],
          }),
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }


        const aiReply = await response.json();
        console.log('✅ API Response:', aiReply);
  

        if (Array.isArray(aiReply)) {
          // 遍历返回的三条消息，先为每条消息添加一个 loading 消息
          const loadingMessages = aiReply.map((item, index) => ({
            id: `${item.conversation_id}-${index}-loading`, // 唯一 ID，标记为 loading
            text: 'Loading...', // 显示加载中的文本
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            sender: 'loading',
          }));
        
          // 添加所有 loading 消息到状态中
          setMessages((prev) => [...prev, ...loadingMessages]);
        
          // 格式化实际的消息
          const formattedMessages = aiReply.map((item, index) => ({
            id: `${item.conversation_id}-${index}`, // 确保唯一 ID
            text: item.txt_msg || '',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            sender: 'croissant',
            highlights: item.tofelWords?.map((word: { word: any; explanation: any }) => ({
              word: word.word,
              meaning: word.explanation,
            })) || [],
          }));
        
          // 替换 loading 消息为实际的消息
          setTimeout(() => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.sender === 'loading'
                  ? formattedMessages.find((fm) => fm.id === msg.id.replace('-loading', '')) || msg
                  : msg
              )
            );
          }, 1000); // 模拟加载延迟
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error('❌ Failed to start conversation:', error.message);
        } else {
          console.error('❌ Failed to start conversation:', error);
        }
      }
    };
  
    startConversation();
  }, []);
 
  useEffect(() => {
    // 滚动到最新消息
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);
  
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('https://croissant-ai-ms-hackthon.vercel.app/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: '550e8400-e29b-41d4-a716-446655440000', // 替换为实际的用户 ID
            messages: [
              {
                role: 'user',
                content: '',
                conversation_id: 'your-conversation-id', // 替换为实际的会话 ID
              },
            ],
          }),
        });  
        const now = Date.now();

        const loadingMessage = {
          id: (now + 1).toString(),
          text: '',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sender: 'loading',
        };
      
        setMessages((prev) => [...prev, loadingMessage]);

        const aiReply = await res.json();
  
        if (aiReply.txt_msg) {
          const aiMessage = {
            id: loadingMessage.id,
            text: aiReply.txt_msg || '',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            sender: 'croissant',
            highlights: aiReply.tofelWords?.map((word: { word: any; explanation: any; }) => ({
              word: word.word,
              meaning: word.explanation,
            })) || [],
          };
      
          setMessages((prev) =>
            prev.map((msg) => (msg.id === loadingMessage.id ? aiMessage : msg))
          );
        }
      } catch (err) {
        console.error('Polling failed:', err);
      }
    }, 50000); // poll every 5 seconds
  
    return () => clearInterval(interval);
  }, []);
  
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
  
    try {
      const response = await fetch('https://croissant-ai-ms-hackthon.vercel.app/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: '550e8400-e29b-41d4-a716-446655440000', // 替换为实际的用户 ID
          messages: [
            {
              role: 'user',
              content: userMessage.text,
              conversation_id: 'your-conversation-id', // 替换为实际的会话 ID
            },
          ],
        }),
      });
  
      const aiReply = await response.json();
  
      const aiMessage = {
        id: loadingMessage.id,
        text: aiReply.txt_msg || '',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: 'croissant',
        highlights: aiReply.tofelWords?.map((word: { word: any; explanation: any; }) => ({
          word: word.word,
          meaning: word.explanation,
        })) || [],
      };
  
      setMessages((prev) =>
        prev.map((msg) => (msg.id === loadingMessage.id ? aiMessage : msg))
      );
    } catch (error) {
      console.error('Error sending message:', error);
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
