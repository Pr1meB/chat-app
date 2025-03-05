import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Chatie</h1>
        <p className="text-gray-600 mb-6">Sign up or log in to start chatting!</p>
        <div className="flex justify-center space-x-4">
          <Link to="/signup">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition">
              Sign Up
            </button>
          </Link>
          <Link to="/login">
            <button className="px-4 py-2 bg-gray-700 text-white rounded-lg shadow-md hover:bg-gray-800 transition">
              Log In
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
