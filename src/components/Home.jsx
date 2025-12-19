import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
       <div className="bg-white/60 backdrop-blur-md p-10 rounded-3xl shadow-xl max-w-2xl border border-white/50">
          <h1 className="text-5xl font-black bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text mb-4">
             Welcome to Sosmed! ✨
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
             Connect, share, and discover amazing stories from friends and people around you. Your journey starts here.
          </p>
          <div className="flex justify-center gap-4">
             <Link 
               to="/create-post" 
               className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
             >
                Start Exploring 🚀
             </Link>
             <Link 
               to="/profile" 
               className="px-8 py-4 bg-white text-purple-600 text-lg font-bold rounded-xl shadow-md hover:shadow-lg hover:bg-gray-50 transition-all border border-purple-100"
             >
                My Profile 👤
             </Link>
          </div>
       </div>
    </div>
  );
};

export default Home;
