import { CymbalsAnim } from './loadingScreenAnim';
import './animation.css';

export function LoadingOverlay({ show }) {
  if (!show) return null;

  return (
    <div className="domLoadingOverlay">
      <div className="loadingAnimInner">
        <CymbalsAnim />
      </div>
    </div>
  );
}

export default LoadingOverlay;
