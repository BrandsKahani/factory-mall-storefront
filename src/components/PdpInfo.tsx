import { FiTruck, FiRotateCcw } from "react-icons/fi";

export default function PdpInfo() {
  return (
    <div className="pdp-info-box">
      <div className="pdp-info-row">
        <FiTruck size={18} className="pdp-info-icon" />
        <div>
          <div className="pdp-info-title">Instant dispatch, no delays</div>
          <div className="pdp-info-desc">Fast express delivery in Pakistan</div>
        </div>
      </div>

      <div className="pdp-info-row">
        <FiRotateCcw size={18} className="pdp-info-icon" />
        <div>
          <div className="pdp-info-title">Easy 14 days return</div>
          <div className="pdp-info-desc">Exchange or return within 14 days</div>
        </div>
      </div>
    </div>
  );
}
