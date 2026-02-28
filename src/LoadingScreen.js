import './App.css';
import "./animation.css";
import "./media.css";
import { StStephen } from "./stStephenLoad";

export function LoadingScreen({ show }) {
  return (
    <div
      className={`loadingContainer ${show ? "" : "fadeout"}`}
      style={{
        zIndex: 9999,
        opacity: show ? 1 : 0,
        pointerEvents: show ? "auto" : "none",
        background: "var(--thirdly)",
        width: "100%",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        transition: "opacity 1s ease",
      }}
    >
      <StStephen />
    </div>
  );
}
