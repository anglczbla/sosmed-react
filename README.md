# 🌐 Social Media App

A modern and feature-rich social media application built with React. Users can share posts, interact with content, follow other users, and manage their profiles in a clean and responsive interface.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://sosmed-react-angel.vercel.app/)
[![React](https://img.shields.io/badge/React-19.2.0-blue)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1.17-38B2AC)](https://tailwindcss.com/)

## ✨ Features

### 👤 User Management
- **Authentication** - Secure login and registration system
- **Profile Management** - Update profile information and avatar
- **Follow System** - Follow and unfollow other users

### 📝 Content Creation
- **Create Posts** - Share photos with captions
- **Edit Posts** - Update your existing posts
- **Delete Posts** - Remove posts you no longer want
- **Add Tags** - Categorize posts with hashtags

### 💬 Social Interactions
- **Like Posts** - Show appreciation for content
- **Comment System** - Engage in conversations
- **Edit Comments** - Modify your comments
- **Delete Comments** - Remove unwanted comments

### 📱 User Experience
- Responsive design for all devices
- Real-time updates with React Query
- Smooth navigation with React Router
- Clean and modern UI with Tailwind CSS

## 🖼️ Screenshots

### Home Feed
![Home Feed](https://github.com/user-attachments/assets/d9f7ca89-8252-4b9e-9def-be13968e9048)
*Main feed showing posts from followed users*

### Profile Page
![Profile Page](https://github.com/user-attachments/assets/3d33528d-620c-4491-a64b-1df15ebddb65)
*User profile with posts and follower information*

### Post Detail
![Post Detail](https://github.com/user-attachments/assets/d95899db-de7e-4436-8618-434eac6e54ed)
*Detailed view with comments and interactions*

### Create Post
![Create Post](https://github.com/user-attachments/assets/d3c2fc95-6f0a-461c-b0ab-6fb70b498496)
*Interface for creating new posts*

## 🛠️ Tech Stack

- **Frontend Framework:** React 19.2.0
- **Build Tool:** Vite 7.2.4
- **Styling:** TailwindCSS 4.1.17
- **UI Components:** Material-UI (MUI) 7.3.6
- **State Management:** TanStack React Query 5.90.12
- **Routing:** React Router DOM 7.10.1
- **HTTP Client:** Axios 1.13.2
- **Icons:** Lucide React 0.562.0

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/sosmed-react.git
   cd sosmed-react
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=your_api_url_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The build files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
sosmed-react/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   ├── services/       # API services
│   ├── utils/          # Utility functions
│   ├── App.jsx         # Main app component
│   └── main.jsx        # Entry point
├── package.json
└── vite.config.js
```

## 🙏 Acknowledgments

- Design inspiration from modern social media platforms
- Icons by [Lucide](https://lucide.dev)
- UI components from [Material-UI](https://mui.com)

---

⭐ If you find this project useful, please consider giving it a star!
