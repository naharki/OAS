import { useState } from "react";

const useAlert = (timeout = 3000) => {
  const [alert, setAlert] = useState({ type: "", message: "" });

  const showAlert = (type, message) => {
    setAlert({ type, message });

    if (timeout) {
      setTimeout(() => {
        setAlert({ type: "", message: "" });
      }, timeout);
    }
  };

  const clearAlert = () => {
    setAlert({ type: "", message: "" });
  };

  return {
    alert,
    showAlert,
    clearAlert,
  };
};

export default useAlert;
