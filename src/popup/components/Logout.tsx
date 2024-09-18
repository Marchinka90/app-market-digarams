import React from "react";

interface LogoutProps {
  onLogout: () => void;
}

const Logout: React.FC<LogoutProps> = ({ onLogout }) => {
  return (
    <div className="text-center">
      <p className="text-xl mb-4">Welcome!</p>
      <button
        onClick={onLogout}
        className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};

export default Logout;
