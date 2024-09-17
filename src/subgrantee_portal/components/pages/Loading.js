import React from "react";
import Lottie from "react-lottie";
import loadingAnimation from "./loading.json"; // Path to your animation file

const Loading = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <Lottie options={defaultOptions} height={100} width={100} />
    </div>
  );
};

export default Loading;
