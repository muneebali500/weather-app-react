import { useEffect } from "react";

const Toast = ({ message, showToast, setShowToast }) => {
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000); // Hide the toast after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [showToast, setShowToast]);

  return (
    <div className={`toast ${showToast ? "show" : ""}`}>
      <div className="toast-content">
        <p className="mr-2">{message}</p>
        <button className="close-button" onClick={() => setShowToast(false)}>
          &times;
        </button>
      </div>
    </div>
  );
};

export default Toast;
