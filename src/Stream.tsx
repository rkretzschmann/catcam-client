import { useEffect, useRef, useState } from "react";
import FullscreenButton from "./components/FullscreenButton";
import { Backdrop, CircularProgress } from "@mui/material";

const Stream = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isContentLoaded, setIsContentLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Dynamically construct the default stream URL based on the app's IP/hostname and port
  const getDefaultStreamUrl = () => {
    const hostname = window.location.hostname; // Gets IP or hostname of the app
    return `http://${hostname}:7123/stream.mjpg`;
  };

  // Function to get the stream URL from URL params or fallback to default
  const getStreamUrlFromParams = () => {
    const params = new URLSearchParams(window.location.search);
    const paramUrl = params.get("streamUrl");
    return paramUrl || getDefaultStreamUrl(); // Fallback to the default stream URL
  };

  const [streamUrl, setStreamUrl] = useState(getStreamUrlFromParams());

  useEffect(() => {
    if (hasError && retryCount < 5000) {
      const retryTimeout = setTimeout(() => {
        setRetryCount((prev) => prev + 1);
        setHasError(false); // Reset error state to retry loading
        setStreamUrl(
          `${getStreamUrlFromParams()}?retry=${Date.now()}` // Append retry query
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
