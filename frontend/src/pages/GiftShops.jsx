import Header from "../components/header";
import DiningCard from "../components/diningCard";
import "./events.css";
import { useEffect, useState } from "react";
import axios from "axios";
import "./DataEntryForm.css";

export default function GiftShops() {
  const [shopList, setShopList] = useState([]);
  const getShops = () => {
    axios
      .get("http://localhost:3000/shops/readGiftShops")
      .then((res) => setShopList(res.data.result))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    getShops();
  }, []);
  return (
    <div>
      <Header />
      <div className="parkTitle">
        <h1>Gift Shops</h1>
        <p>
          Bringing home the perfect souvenir from a day at the park can make
          your memories last a lifetime. Whether its a cool T-Shirt or hat in
          the latest style, an adorable stuffed animal, or the perfect photo of
          your crew zooming down the rails of a giant roller coaster, youll only
          find it at Theme Park. The parks non-stop smiles and fun are reflected
          in a broad range of exceptional products that youll have as much fun
          collecting and wearing as you do riding the colossal roller coasters.
        </p>
      </div>
      {shopList &&
        shopList.map((shop, index) => (
          <DiningCard
            key={index}
            diningImage={shop.imageFileName}
            diningLocation={shop.location}
            diningName={shop.shopName}
            diningOverview={shop.shopDesc}
          />
        ))}
    </div>
  );
}
