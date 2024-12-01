import { useEffect, useRef, useState } from "react";
import FullscreenButton from "./components/FullscreenButton";
import { Backdrop, CircularProgress } from "@mui/material";

const Stream = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isContentLoaded, setIsContentLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [streamUrl, setStreamUrl] = useState(
    "http://192.168.178.125:7123/stream.mjpg"
  );

  useEffect(() => {
    if (hasError && retryCount < 5000) {
      const retryTimeout = setTimeout(() => {
        setRetryCount((prev) => prev + 1);
        setHasError(false); // Reset error state to retry loading
        // Change the stream URL to trigger a reload
        setStreamUrl(
          `http://192.168.178.125:7123/stream.mjpg?retry=${Date.now()}`
        );
      }, 3000);
      return () => clearTimeout(retryTimeout); // Clear timeout if component unmounts
    }
  }, [hasError, retryCount]);

  // Handle the image loading error
  const handleError = () => {
    setHasError(true); // Set error state when the stream fails to load
  };

  const centerScrollbar = () => {
    if (containerRef.current) {
      const container = containerRef.current;
      container.scrollLeft =
        (container.scrollWidth - container.clientWidth) / 2;
    }
  };

  useEffect(() => {
    if (isContentLoaded) {
      centerScrollbar();
    }
  }, [isContentLoaded]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "calc(var(--vh, 1vh) * 100)", // Use dynamic height variable
        overflowX: "auto",
        overflowY: "hidden",
        backgroundColor: "black",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {!isContentLoaded ? (
        <Backdrop open sx={{ backgroundColor: "black" }}>
          <CircularProgress />
        </Backdrop>
      ) : null}

      <img
        src={streamUrl}
        alt="Video Stream"
        onLoad={() => {
          console.log("Loaded");
          setIsContentLoaded(true);
        }} // Set content loaded state
        onError={handleError} // Set error state if image fails to load
        style={{
          height: "100%",
          width: "auto",
          display: "block",
        }}
      />
      <FullscreenButton containerRef={containerRef} />
    </div>
  );
};

export default Stream;
