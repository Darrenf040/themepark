import Header from "../components/header";
import DiningCard from "../components/diningCard";
import "./events.css";
import { useEffect, useState } from "react";
import axios from "axios";
import "./DataEntryForm.css";
import "./Rides.css";

export default function Dining() {
  const [restaurantList, setRestaurantList] = useState([]);
  const getRestaurants = () => {
    axios
      .get("https://themepark-backend.onrender.com/shops/readRestaurants")
      .then((res) => setRestaurantList(res.data.result))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    getRestaurants();
  }, []);
  return (
    <div>
      <Header />
      <div class="parkTitle">
      <h1>Restaurants & Dining</h1>
      <p>
      Theme Park offers a wide variety of different kinds of food to eat and environments to eat it in. Whether you’re looking for just a snack or a full meal, we have exactly what you need to keep you fueled up for the rest of the day.
      </p>
      <div>
        <h2>Filter By</h2>
        <select name="dining" id="dining">
          <option value="all">All Resturants</option>
          <option value="kids">Mexican Food</option>
          <option value="kids">Italian Food</option>
          <option value="kids">Snacks & Beverages</option>
          <option value="family">Desserts</option>
        </select>
      </div>
      </div>
      {restaurantList &&
        restaurantList.map((restaurant, index) => (
          <DiningCard
            key={index}
            diningImage={restaurant.imageFileName}
            diningLocation={restaurant.location}
            diningName={restaurant.shopName}
            diningProducts={"products here"}
            diningOverview={restaurant.shopDesc}
          />
        ))}
    </div>
  );
}
