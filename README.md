# 🛋️ Interior Design Using Augmented Reality

> A Final Year Project built using **React Native** and **AR** technology to help users visualize furniture in their real environment — before buying or rearranging anything.

---

## 📱 About the Project

**Interior Design using Augmented Reality** empowers users to design their living space by virtually placing 3D furniture models inside a room using just a mobile camera. Built with React Native and `@reactvision/react-viro`, this app simulates real-world furniture placement for better visualization and decision-making.

---

## 🚀 Features

- 🛋️ Real-time placement of 3D furniture models using AR
- 📏 Input room type and dimensions
- 🔄 Drag, move, and rotate furniture in AR view
- 📸 Take AR snapshots and save them
- 🗂️ Browse preloaded furniture by category
- 💾 Save your design configuration
- 🌐 Cross-platform support (tested on Android)

---

## 🧰 Tech Stack

| Technology                  | Purpose                                |
|----------------------------|----------------------------------------|
| React Native (TypeScript)  | Core mobile app development            |
| Expo                       | Simplified build, test, and preview    |
| @reactvision/react-viro    | AR view and object rendering           |
| Three.js (via GLTF models) | 3D model compatibility and rendering   |
| Figma/Canva                | UI design prototyping                  |

---

## 🛠️ Installation Instructions

```bash
# Clone the repo
git clone https://github.com/yourusername/interior-design-ar.git
cd interior-design-ar

# Install dependencies
npm install

# Start the project
npx react-native run-android
