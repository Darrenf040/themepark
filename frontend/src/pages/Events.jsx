import Header from "../components/header";
import EventSection from "../components/eventSection";
import "./events.css";
import { useEffect, useState } from "react";
import axios from "axios";
import "./DataEntryForm.css";

export default function Events() {
  const [eventList, setEventList] = useState([]);
  const getEvents = () => {
    axios
      .get("http://localhost:3000events/read")
      .then((res) => setEventList(res.data.result))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    getEvents();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return date.toLocaleDateString("en-TX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <>
      <Header />
      <div className="hero">
        <h1>Special Events</h1>
      </div>
      {eventList &&
        eventList.map((event, index) => (
          <EventSection
            key={index}
            eventName={event.eventName}
            eventStart={formatDate(event.startDate)}
            eventEnd={formatDate(event.endDate)}
            eventDescription={event.eventType}
            eventImage={event.imageFileName}
          />
        ))}
    </>
  );
}
