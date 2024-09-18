import React from "react";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="h-80 inset-0 bg-white bg-opacity-90 flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-purple-700 border-t-transparent border-double rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingSpinner;
