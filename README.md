<div align="center">

# 🎴 SwipeDeck  

🔥 **Tinder-style Swipe Deck App** built with **React Native + TypeScript** 🔥  

<p>
  <img src="https://img.shields.io/badge/React%20Native-0.75-blue?logo=react" alt="React Native" />
  <img src="https://img.shields.io/badge/Expo-Supported-lightblue?logo=expo" alt="Expo" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License" />
</p>

👎 **Swipe Left** &nbsp; • &nbsp; 👍 **Swipe Right** &nbsp; • &nbsp; 📊 **Track Results** &nbsp; • &nbsp; 🌗 **Dark/Light Mode**

---

✨ **Features**  
✅ Smooth **animations** & gesture handling  
✅ ⏪ **Undo last swipe**  
✅ 💾 Persistent state with **AsyncStorage**  
✅ 📱 Modern UI powered by **React Navigation**  

</div>

---

## 🛠️ Tech Stack

- ⚛️ **React Native**
- 🎬 **Animated API + PanResponder**
- 📦 **AsyncStorage**
- 🧭 **React Navigation**
- 💻 **TypeScript**

---
## 📝 Design Notes  

For gestures and animations, I chose the **React Native Animated API with PanResponder** because it provides smooth, low-level control over swipe interactions while staying lightweight. This approach allowed me to build natural swipe gestures with spring animations, thresholds for swipe validation, and visual feedback like fading 👍/👎 labels. I considered Reanimated, but Animated + PanResponder was sufficient and simpler for a lightweight project.  

The project structure is organized around **separation of concerns**. Data fetching and persistence live inside **custom hooks** (`useUsers`) and storage utilities (`storage.ts`) so that screens stay focused on UI logic. Reusable UI building blocks like `Card` and `Deck` handle presentation and gestures, while screens (`HomeScreen`, `SummaryScreen`) manage navigation and state orchestration. This separation makes the app easy to extend (e.g., infinite deck, new summary views) without touching gesture logic.  

One trade-off was keeping **Undo** simple. Instead of fully animating a card back into the stack, I reset the state and card position, which avoids complex animation edge cases but may feel less polished compared to Tinder’s real undo animation. Another edge case was handling **resume after app restart** — I solved this by persisting both swipe results and the current index in AsyncStorage, so the deck restores seamlessly. Finally, I added a fallback when the deck ends to ensure users always reach the **Summary screen**, even if navigation didn’t auto-trigger.  

---

## 🚀 Getting Started

Clone the repo and install dependencies:

```bash
git clone https://github.com/niteshchauhan0/SwipeDeck.git
cd SwipeDeck
npm install
```

Run the app:
```bash
npm start
```
or for bare RN:
```bash
npx react-native run-ios
npx react-native run-android
```
---

## 📂 Project Structure:
```bash
SwipeDeck/
├── App.tsx
├── src/
│   ├── components/
│   │   ├── Card.tsx
│   │   └── Deck.tsx
│   ├── hooks/
│   │   └── useUsers.ts
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   └── SummaryScreen.tsx
│   ├── storage/
│   │   └── index.ts
│   └── types.ts

```

---

🧪 Testing

Run tests with:

```bash
yarn test
```
---
## 💡 Future Improvements

🔄 Infinite scrolling (fetch more users dynamically)

🎭 Improved animations with React Native Reanimated

🌐 Multi-language support

📱 Deploy to iOS & Android app stores

---

## 👨‍💻 Author

Nitesh Singh




