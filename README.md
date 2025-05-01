
# Wordish AI

**Wordish AI** is an AI-powered vocabulary learning and chat application designed to help users learn new words and improve their language skills through engaging, interactive experiences.

## Features

- **AI Chat**: Engage in natural language conversations with an AI that provides contextual word explanations and learning suggestions.
- **Word Highlighting**: Automatically detect and highlight key words in chat, offering definitions and related information.
- **Word Club**: Manage and track learned words with status tags such as `Stranger`, `First Date`, `We've met`, and `A Match`.
- **Embedded Word Detail View**: Access detailed word cards and learning progress within the Word Club panel.
- **Smooth Animations**: Interactive and smooth animations powered by React Native Reanimated.

## Tech Stack

- **Frontend**: React Native
- **Animation**: React Native Reanimated
- **Routing**: Expo Router
- **Font Management**: Expo Font
- **State Management**: React Hooks
- **Backend**: RESTful API for AI services

## Project Structure


wordish-ai/
├── assets/                  # Static assets (images, fonts, etc.)
│   ├── fonts/              # Custom fonts
│   ├── home_images/        # Images used on the home screen
│   ├── memes/              # Vocabulary-related images
├── components/             # Reusable React Native components
│   ├── MessageWithHighlight.tsx  # Message component with highlighted words
│   ├── WordClubPanel.tsx         # Word Club panel component
├── app/                    # Application pages
│   ├── chat/               # Chat interface
│   ├── profile/            # User profile
├── README.md               # Project description
├── package.json            # Project dependencies
├── react-native.config.js  # Font linking configuration
```
## Try it！
<img width="497" alt="image" src="https://github.com/user-attachments/assets/3938d3d8-0fad-45ba-ad9d-5ebdc9ae361e" />

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/wordish-ai.git
cd wordish-ai
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Link font assets

```bash
npx react-native link
```

### 4. Start the app

```bash
# For Expo
npx expo start
```

### 5. Run on platform

```bash
# iOS
npx expo run:ios

# Android
npx expo run:android
```

## Usage

### Chat

- Enter a message in the chat page.
- The AI will respond contextually and highlight important vocabulary words.

### Word Club

- Tap the Word Club button to view learned words and their learning statuses.
- Tap any word to view its full details and progress stages.

### Word Statuses

- `Stranger`: New word
- `First Date`: Initial interaction
- `We've met`: Familiar with the word
- `A Match`: Mastered

## Contribution

Contributions are welcome! To contribute:

1. Fork this repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your message here"
   ```
4. Push the branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a Pull Request.

## License

This project is licensed under the MIT License.

