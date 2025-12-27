import { useEffect } from "react";
import './App.css';
import "./animation.css";
import "./media.css";
import { StStephen } from "./stStephenLoad";

export function LoadingScreen({ loading, setLoading }) {
  useEffect(() => {
    const timer = setTimeout(() => setLoading(true), 2500);
    return () => clearTimeout(timer);
  }, [setLoading]);

  return (
    <div
      className={`loadingContainer ${loading ? "fadeout" : ""}`}
      style={{
        zIndex: 1000,
        opacity: loading ? 0 : 1,
        pointerEvents: "none",
        background: "var(--thirdly)",
        width: "100%",
        height: "100vh",
        position: "absolute",
        left: 0,
        top: 0,
        transition: "opacity 1s ease",
      }}
    >
      <StStephen />
    </div>
  );
}
