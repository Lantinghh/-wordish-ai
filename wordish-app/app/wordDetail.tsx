// app/wordDetail.tsx
"use client";

import { View, Text, StyleSheet, Image, ScrollView, Pressable } from "react-native";
import { GREWords } from "@/vocab/GREWords";
import { useFonts } from "expo-font";
import { useSearchParams } from "expo-router/build/hooks";

export default function WordDetailPage() {
  const params = useSearchParams();
  const word = params.get("word") as string;


  const wordInfo = GREWords.find((w) => w.word.toLowerCase() === word?.toLowerCase());

  if (!wordInfo) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Word not found!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.wordTitle}>{wordInfo.word}</Text>

        {/* 状态：写死 First Date 示例 */}
        <View style={[styles.statusBadge, { backgroundColor: '#FFE134' }]}> 
          <Text style={styles.statusText}>First Date</Text>
        </View>

        {/* 示例句子 */}
        <Text style={styles.exampleText}>
          Uh-huh. That’s the most <Text style={styles.highlightWord}>{wordInfo.word}</Text> way I've ever seen someone try to run into me "by chance."
        </Text>

        {/* Meme 图片 */}
        <View style={styles.memeContainer}>
          <Image source={wordInfo.meme} style={styles.memeImage} resizeMode="contain" />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 60,
  },
  wordTitle: {
    fontSize: 28,
    fontFamily: 'Figma Hand',
    fontStyle: 'italic',
    marginBottom: 20,
    color: '#000',
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 20,
  },
  statusText: {
    fontSize: 18,
    color: '#FE5A1C',
    fontFamily: 'Figma Hand',
    fontStyle: 'italic',
  },
  exampleText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  highlightWord: {
    color: '#3366CC',
    textDecorationLine: 'underline',
  },
  memeContainer: {
    width: 250,
    height: 250,
    marginTop: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  memeImage: {
    width: '100%',
    height: '100%',
  },
  errorText: {
    fontSize: 20,
    color: 'red',
    textAlign: 'center',
    marginTop: 100,
  },
});
