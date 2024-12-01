import { useEffect, useRef, useState } from "react";
import FullscreenButton from "./components/FullscreenButton";

const Stream = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isContentLoaded, setIsContentLoaded] = useState(false);

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
      <img
        src="http://192.168.178.125:7123/stream.mjpg"
        alt="Video Stream"
        onLoad={() => setIsContentLoaded(true)}
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
