import PropTypes from "prop-types";
import "./rideCard.css";

export default function DiningCard({
  diningImage,
  diningName,
  diningLocation,
  diningOverview,
}) {
  return (
    <div className="card-container">
      <div>
      <img className="card-image" src={`/images/${diningImage}`} alt="Image not found" />
      </div>
      <div className="content-container">
        <h1>{diningName}</h1>
        <p>{`Location: ${diningLocation}`}</p>
        <p>{diningOverview}</p>
      </div>
    </div>
  );
}
DiningCard.propTypes = {
  diningImage: PropTypes.string.isRequired,
  diningName: PropTypes.string,
  diningLocation: PropTypes.string,
  diningOverview: PropTypes.string,
};