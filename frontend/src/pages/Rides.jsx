import Header from "../components/header";
import RideCard from "../components/rideCard";
import axios from "axios";
import { useEffect, useState } from "react";
import "./events.css";
import "./Rides.css";

export default function Rides() {
  const [rides, setRides] = useState([]);
  const [rideFilter, setRideFilter] = useState("all");

  const ridesList = () => {
    axios
      .get("https://gleaming-lokum-158537.netlify.app/rides/read")
      .then((res) => {
        setRides(
          res.data.result.filter((ride) => {
            if (rideFilter == "all") {
              return ride;
            } else {
              return ride.rideType == rideFilter;
            }
          })
        );
      })
      .catch((err) => console.error(err));
  };
  useEffect(() => {
    ridesList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rideFilter]);
  return (
    <>
      <Header />
      <div className="parkTitle">
        <h1>Park Rides</h1>
        <p>
          From thrilling coasters to rides for the kids, Theme Park has
          something for everyone.
        </p>
        <div>
          <h2>Filter By</h2>
          <select
            name="rides"
            id="rides"
            onChange={(e) => setRideFilter(e.target.value)}
          >
            <option value="all">All Rides</option>
            <option value="family">Family Rides</option>
            <option value="kid">Kids Rides</option>
          </select>
        </div>
      </div>
      {rides &&
        rides.map((ride, index) => {
          return (
            <div key={index}>
              <RideCard
                rideName={ride.rideName}
                rideCapacity={ride.capacity}
                rideImage={ride.imageFileName}
                rideDescription={ride.rideDesc}
              />
            </div>
          );
        })}
    </>
  );
}
