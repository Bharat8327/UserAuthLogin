import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400 p-6">
      <div className="bg-white rounded-lg shadow-lg w-full sm:w-96 lg:w-1/2 xl:w-1/3 p-8 text-center">
        <motion.div
          className="flex justify-center mb-6"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/151/151824.png"
            alt="404"
            className="w-24 h-24 sm:w-32 sm:h-32 mb-4"
          />
        </motion.div>
        <h2 className="text-3xl font-semibold text-gray-700 mb-4">
          Oops! Page Not Found
        </h2>
        <p className="text-gray-600 mb-6 text-sm sm:text-base">
          We couldn’t find the page you’re looking for. It might have been moved
          or deleted.
        </p>
        <button
          onClick={() => navigate('/')}
          className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-semibold text-lg transition-transform transform hover:scale-105 active:scale-95"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default PageNotFound;
