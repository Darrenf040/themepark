import PropTypes from "prop-types";
import "./eventSection.css";
export default function EventSection({
  eventName,
  eventStart,
  eventEnd,
  eventDescription,
  eventImage,
}) {
  return (
    <section>
      <div
        className="event-container"
        style={{ backgroundImage: `url(http://localhost:3000images/${eventImage})` }}
      >
        <h1>{eventName}</h1>
        <p><span>{`Start Date: ${eventStart}`}</span></p>
        <p><span>{`End Date: ${eventEnd}`}</span></p>
        <p><span>{eventDescription}</span></p>
      </div>
    </section>
  );
}

EventSection.propTypes = {
  eventName: PropTypes.string,
  eventStart: PropTypes.string,
  eventEnd: PropTypes.string,
  eventDescription: PropTypes.string,
  eventImage: PropTypes.string,
};
