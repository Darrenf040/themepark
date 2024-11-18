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
      .get("http://localhost:3000rides/read")
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
          something for everyone. Dare to take on heart-pounding roller coasters
          or enjoy gentle attractions perfect for the little ones. Families can
          explore interactive play areas, while thrill-seekers chase the
          adrenaline on gravity-defying rides. No matter your age, the park
          offers unforgettable fun for all!
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
