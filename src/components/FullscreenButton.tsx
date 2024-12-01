import { Fullscreen, FullscreenExit } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";

export type FullscreenButtonProps = {
  onClick?: () => {};
  containerRef: React.MutableRefObject<HTMLDivElement | null>;
};

const FullscreenButton = ({ containerRef, onClick }: FullscreenButtonProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Adjust height to fix mobile browser toolbar issues
  useEffect(() => {
    const updateHeight = () => {
      const vh = window.innerHeight * 0.01; // Get 1% of the visible height
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  // Toggle Fullscreen mode
  const handleFullscreen = () => {
    if (isFullscreen) {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen(); // Safari
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen(); // IE/Edge
      }
    } else {
      // Enter fullscreen
      if (containerRef.current) {
        if (containerRef.current.requestFullscreen) {
          containerRef.current.requestFullscreen();
        } else if (containerRef.current.webkitRequestFullscreen) {
          containerRef.current.webkitRequestFullscreen(); // Safari
        } else if (containerRef.current.msRequestFullscreen) {
          containerRef.current.msRequestFullscreen(); // IE/Edge
        }
      }
    }
    setIsFullscreen(!isFullscreen); // Toggle the fullscreen state
    if (onClick) {
      onClick();
    }
  };

  useEffect(() => {
    const handleDoubleClick = () => handleFullscreen();
    const container = containerRef.current;
    if (container) {
      container.addEventListener("dblclick", handleDoubleClick);
    }

    return () => {
      if (container) {
        container.removeEventListener("dblclick", handleDoubleClick);
      }
    };
  }, [containerRef, isFullscreen]);
  return (
    <Button
      onClick={handleFullscreen}
      variant="outlined"
      style={{
        outline: "none",
        height: "64px",
        width: "64px",
        position: "fixed", // Button stays fixed on the viewport
        bottom: "20px",
        right: "20px",
        padding: "0",
        backgroundColor: "rgba(0, 0, 0, 0)",
        color: "white",
        border: "none",
        cursor: "pointer",
        zIndex: 1000, // Ensures the button is on top of other elements
      }}
    >
      {isFullscreen ? (
        <FullscreenExit fontSize="large" />
      ) : (
        <Fullscreen fontSize="large" />
      )}
    </Button>
  );
};

export default FullscreenButton;
