import React, { useCallback, useState } from "react";
import { toast } from "react-toastify";

const useLoadingHandler = (initialState = {}) => {
  const [loadingStates, setLoadingStates] = useState(initialState);

  const startLoading = useCallback((key) => {
    setLoadingStates((prev) => ({ ...prev, [key]: true }));
  }, []);

  const stopLoading = useCallback((key) => {
    setLoadingStates((prev) => ({ ...prev, [key]: false }));
  }, []);

  const handleLoading = useCallback(
    async (key, asyncFunction, errorMessage = "An error ocurred") => {
      startLoading(key);
      try {
        const result = await asyncFunction();
        stopLoading(key);
        return result;
      } catch (error) {
        console.error("Error in ${key}:", error);
        toast.error(errorMessage);
        stopLoading(key);
        throw error;
      }
    },
    [startLoading, stopLoading]
  );

  return {
    loadingStates,
    startLoading,
    stopLoading,
    handleLoading,
  };
};

export default useLoadingHandler;
