// app/welcome/index.tsx
import { Redirect } from 'expo-router';

export default function WelcomeRoot() {
  return <Redirect href="../chat" />;
}
