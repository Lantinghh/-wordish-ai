// app/chat/index.tsx
import { useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import WordClubPanel from '../components/WordClubPanel';

export default function ChatMainPage() {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: "Met a guy. Crashed into him. Didn’t get sued. 10/10 would do again 🫠",
      time: '16:26',
      sender: 'croissant',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isWordClubVisible, setWordClubVisible] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMessage = {
      id: Date.now().toString(),
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: 'me',
    };
    setMessages((prev) => [...prev, newMessage]);
    setInputText('');
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Image source={require('../../assets/home_images/menu.png')} style={styles.menuIcon} />
          <Text style={styles.headerTitle}>Chat</Text>
          <Text style={styles.username}>Stella_SpicyCroissant</Text>
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
              <Text style={styles.name}>Stella_SpicyCroissant</Text>
              <Text style={styles.subtext}>You’re friends on Wordish</Text>
              <Image source={require('../../assets/home_images/friends.png')} style={styles.friendIcon} />
              <Text style={styles.hint}>Say hi to your new Wordish friend, Stella.</Text>
            </View>
          }
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <View>
              <Text style={styles.timestamp}>{item.time}</Text>
              <View style={[styles.messageRow, item.sender === 'me' && { flexDirection: 'row-reverse' }]}>
                <Image source={require('../../assets/home_images/profile_pic.png')} style={styles.bubbleAvatar} />
                <View style={[styles.bubble, item.sender === 'me' && { backgroundColor: '#DCF8C6' }]}>
                  <Text style={styles.messageText}>{item.text}</Text>
                </View>
              </View>
            </View>
          )}
        />

        <View style={styles.inputBar}>
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
  menuIcon: { position: 'absolute', left: 0, top:8 , width: 24, height: 24 },
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
  messageText: { fontSize: 14 },

  inputBar: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
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
