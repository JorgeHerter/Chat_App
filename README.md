# 💬 ChatApp: A React Native Mobile Chat Application

## ✨ Project Overview

This project aims to build a modern, feature-rich chat application for mobile devices using **React Native**. It's designed to provide a seamless messaging experience, allowing users to communicate via text, share images, and even send their live location. This app serves as a portfolio piece to demonstrate robust JavaScript mobile development skills using cutting-edge technologies.

## 🎯 Objective

To develop a high-quality, cross-platform (iOS & Android) chat application leveraging React Native, Expo, and Google Firebase, emphasizing user experience, real-time communication, and data persistence.

## 🚀 Context

In today's mobile-first world, native mobile apps are crucial. Historically, this meant maintaining separate codebases for iOS and Android. React Native revolutionizes this by enabling a single codebase for both platforms, drastically reducing development time and cost. This project highlights the power of React Native, integrated with powerful backend services like Google Firestore, to create indispensable mobile experiences.

---

## 5️⃣ The 5 Ws of ChatApp

* **Who:** Friends, family, or fellow students looking for a simple, effective way to communicate. Also, other developers who will work with this codebase. 🧑‍🤝‍🧑
* **What:** A native chat application built with React Native, accompanied by relevant documentation (like this README!). 📱
* **When:** Any time users wish to connect and exchange messages. ⏰
* **Where:** Optimized for both Android and iOS devices, developed with Expo and powered by Google Firestore for chat message storage. 🌍
* **Why:** Chat apps are globally popular and essential for communication. This project showcases proficiency in React Native development, a highly sought-after skill. 💡

---

## 🌟 Key Features & Requirements

### 📖 User Stories

* **Easy Access:** As a new user, I want to easily enter a chat room to quickly start talking to my friends and family. 🚪
* **Text Messaging:** As a user, I want to send messages to my friends and family members to exchange the latest news. ✍️
* **Image Sharing:** As a user, I want to send images to my friends to show them what I’m currently doing. 📸
* **Location Sharing:** As a user, I want to share my location with my friends to show them where I am. 📍
* **Offline Reading:** As a user, I want to be able to read my messages offline so I can reread conversations at any time. ✈️
* **Accessibility (Screen Reader):** As a user with a visual impairment, I want to use a chat app that is compatible with a screen reader so that I can engage with a chat interface. 🗣️

### ✨ Core Features

* **Start Screen:** A dedicated page where users can input their name and select a background color for their chat screen before joining. 🎨
* **Chat Interface:** A conversation display page with an input field and a submit button for sending messages. 💬
* **Rich Communication:** Support for sending both images and location data within the chat. 🖼️🗺️
* **Data Persistence:** Messages are stored both online (Firebase Firestore) and locally for offline access. 💾

---

## 🛠️ Technical Requirements

* **Framework:** Built entirely with **React Native**. ⚛️
* **Development Environment:** Developed using **Expo**. 엑스포
* **Styling:** Adheres strictly to the provided screen design specifications. 📐
* **Database:** Chat conversations are stored in **Google Firestore Database**. 🔥
* **Authentication:** Anonymous user authentication via **Google Firebase Authentication**. 🔒
* **Local Storage:** Chat conversations are stored locally for offline availability. 💾
* **Image Picking:** Users can select and send images from the phone's image library. 갤러리
* **Camera Integration:** Users can take and send pictures using the device's camera app. 🤳
* **Image Storage:** Images are stored in **Firebase Cloud Storage**. ☁️
* **Location Services:** Ability to read the user’s current location data. 🗺️
* **Map View:** Location data is sent and displayed within the chat in a map view. 📍
* **Chat UI Library:** The chat interface and core functionality are powered by **Gifted Chat**. 🎁
* **Code Quality:** The app's codebase must be well-commented for clarity and maintainability. 📝

---

## 🎨 Screen Design & Assets

### Design Specifications

* **Spacing:** Vertical and horizontal spacing is evenly distributed for a clean layout.
* **App Title:** Font size 45, font weight 600, font color `#FFFFFF`.
* **"Your name" Input:** Font size 16, font weight 300, font color `#757083`, 50% opacity.
* **"Choose background color" Label:** Font size 16, font weight 300, font color `#757083`, 100% opacity.
* **Color Options (HEX):** `#090C08`, `#474056`, `#8A95A5`, `#B9C6AE`.
* **Start Chatting Button:** Font size 16, font weight 600, font color `#FFFFFF`, button color `#757083`.

### Assets

* [Link to Assets Here](https://your-assets-link-here.com) (Replace with the actual link to your assets, e.g., a Google Drive folder or GitHub repo folder.)

---

## 🗺️ Project Deliverables Roadmap

This project is structured into sequential exercises, with each deliverable contributing to the final mobile chat application.

* **✅ Exercise 1: Building Native Applications with JavaScript**
    * Development environment setup (React Native & Expo).
    * App layout and start screen styling based on design.
* **⏳ Exercise 2: Chat UIs & Accessibility**
    * Building the chat screen and core chat functionality with Gifted Chat.
    * Applying initial accessibility considerations.
* **⏳ Exercise 3: Real-Time Applications & Data Storage**
    * Implementing anonymous user authentication with Firebase.
    * Storing chat conversations in Firestore Database.
* **⏳ Exercise 4: Storing Data on the Client-Side**
    * Implementing local chat storage using AsyncStorage.
    * Handling online/offline data synchronization and message creation.
* **⏳ Exercise 5: Communication Features**
    * Enabling users to pick and send images from the device library.
    * Integrating device camera for taking and sending pictures.
    * Storing images in Firebase Cloud Storage.
    * Implementing location data sharing via chat in a map view.
    * Further enhancing app design with accessibility best practices.

---

## 🏃‍♀️ Getting Started (For Developers)

To run this project locally:

1.  **Clone the repository:**
    `git clone <your-repo-link>`
    `cd ChatApp`
2.  **Install dependencies:**
    `npm install` (or `yarn install`)
3.  **Start the Expo development server:**
    `expo start`
4.  **Run on your device/emulator:** Scan the QR code with Expo Go app or use emulator options.

## 🤝 Acknowledgements

* **React Native:** For the amazing mobile development framework.
* **Expo:** For simplifying the development workflow.
* **React Native Gifted Chat:** For the robust and customizable chat UI.
* **Google Firebase (Firestore & Cloud Storage):** For powerful backend services.

---

**Happy Chatting!** 🚀
