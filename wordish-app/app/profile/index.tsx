import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function ProfilePage() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Image source={require('../../assets/wordpanel/back_button.png')} style={styles.backIcon} />
      </TouchableOpacity>

      <View style={styles.header}>
        <Image source={require('../../assets/home_images/my_avatar.png')} style={styles.avatar} />
        <Text style={styles.name}>Stella</Text>
        <Text style={styles.username}>Stella_CrazyApple</Text>
      </View>

      <View style={styles.section}>
        <OptionItem title="Account" />
        <OptionItem title="Intro Story" isLast/>
      </View>

      <Text style={styles.sectionTitle}>MORE ACTIONS</Text>
      <View style={styles.section}>
        <OptionItem title="Search in Conversation" />
        <OptionItem title="Chat Files" isLast />
      </View>

      <Text style={styles.sectionTitle}>PRIVACY</Text>
      <View style={styles.section}>
        <OptionItem title="Notifications" rightText="On" />
        <OptionItem title="Password Protection" rightText="Off" isLast />
      </View>
    </ScrollView>
  );
}

function OptionItem({ title, rightText, isLast }: { title: string; rightText?: string; isLast?: boolean }) {
    return (
      <TouchableOpacity
        style={[
          styles.option,
          isLast && { borderBottomWidth: 0 }, // 如果是最后一项，不要底线
        ]}
      >
        <Text style={styles.optionText}>{title}</Text>
        <Text style={styles.optionRight}>{rightText ?? '>'}</Text>
      </TouchableOpacity>
    );
  }
  

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 20 },
  backButton: { marginTop: 70, marginBottom: 50 },
  backIcon: { position: 'absolute',left: -5,right: 90.77,top: 7.27, bottom: 89.99,  width: 24, height: 24, resizeMode: 'contain',},
  header: { alignItems: 'center', marginBottom: 30 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 8,},
  name: { fontSize: 24, fontWeight: 'bold' },
  username: { fontSize: 14, color: '#999' },
  sectionTitle: { marginTop: 20, marginBottom: 8, color: '#00000059', fontSize: 14,fontWeight: 'bold',  },
  section: { backgroundColor: '#fff', borderRadius: 8, marginBottom: 10 },
  option: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomColor: '#eee', borderBottomWidth: 1 },
  optionText: { fontSize: 16 },
  optionRight: { fontSize: 14, color: '#999' },
});
