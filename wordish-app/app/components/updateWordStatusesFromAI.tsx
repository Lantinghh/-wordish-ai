// 完整版：AI回复出现单词，自动更新appearances和status

import { GREWords } from '../vocab/GREWords';

// 定义通过出现次数计算单词状态的函数
function getStatusByAppearances(count: number): string {
  if (count === 1) return 'Stranger';
  if (count === 2) return 'First Date';
  if (count === 3) return "We've Met";
  return 'A Match!';
}

// 给AI回复里出现的单词+1，并更新状态
export function updateWordStatusesFromAI(aiText: string) {
  const words = aiText.split(/\W+/); // 非单词字符分割

  for (const word of words) {
    const found = GREWords.find(w => w.word.toLowerCase() === word.toLowerCase());
    if (found) {
      found.appearances = (found.appearances || 0) + 1;
      found.status = getStatusByAppearances(found.appearances);
    }
  }
}

// 下面是组件里调用示例（比如在handleSend处理完AI回复后）

// 使用时：
// <Pressable style={[styles.statusButton, getStatusButtonStyle(word.status)]}>
//    <Text style={styles.statusText}>{word.status}</Text>
// </Pressable>

