import AdminHeader from "../components/adminHeader";
import { useEffect, useState } from "react";
import axios from "axios";
import "./GiftShopForm.css";
import Modal from "react-modal";
import "./adminEmployees.css";
import "./DataForm.css";

const ParkStatusForm = () => {
  const [ParkStatusData, setParkStatusData] = useState({
    date: "",
    weatherType: "",
  });
  const [newParkStatus, setNewParkStatus] = useState({
    date: "",
    weatherType: "",
  });
  const [parkStatusList, setParkStatusList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    parkStatusID: "",
    date: "",
    weatherType: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewParkStatus({ ...newParkStatus, [name]: value });
  };

  const handleSubmit = async () => {
    if (newParkStatus.weatherType === "2") {
      const confirm = window.confirm(
        "You are about to input this date as a RAINOUT. Double check the date before proceeding"
      );
      if (!confirm) {
        return;
      }
    }
    console.log(newParkStatus.date);
    console.log(newParkStatus.weatherType);
    try {
      const response = await axios.post(
        "https://themepark-backend.onrender.com/parkstatus/create",
        newParkStatus
      );
      fetchParkStatus();
      setNewParkStatus({
        date: "",
        weatherType: "",
      });
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const fetchParkStatus = async () => {
    try {
      const response = await axios.get(
        "https://themepark-backend.onrender.com/parkstatus/read"
      );
      setParkStatusList(response.data.result);
    } catch (error) {
      console.error("Error fetching shops:", error);
    }
  };

  const getParkStatus = () => {
    axios
      .get("http://localhost:3000parkstatus/read")
      .then((res) => setParkStatusList(res.data.result))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    getParkStatus();
    fetchParkStatus();
  }, []);

  const getWeatherDescription = (weatherType) => {
    switch (weatherType) {
      case 0:
        return "Fair";
      case 1:
        return "Cloudy";
      case 2:
        return "Rainout";
      default:
        return "Not input";
    }
  };

  const getWeatherStyle = (weatherType) => {
    if (weatherType === 2) {
      return { color: "red" };
    }
    return {};
  };

  const getTimeStyle = (time) => {
    if (time === null) {
      return { color: "red" };
    }
    return {};
  };

  const getOpenTime = (openingTime) => {
    switch (openingTime) {
      case null:
        return "CLOSED";
      default:
        return openingTime;
    }
  };

  const getCloseTime = (closingTime) => {
    switch (closingTime) {
      case null:
        return "CLOSED";
      default:
        return closingTime;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return date.toLocaleDateString("en-TX");
  };

  const formatForDateLocal = (dateStr) => {
    const date = new Date(dateStr);
    return date.toISOString().slice(0, 10); // Get the first 16 characters to match datetime-local format
  };

  const openModal = (parkstatus) => {
    const formattedDate = formatForDateLocal(parkstatus.date);
    setFormData({
      parkStatusID: parkstatus.parkStatusID,
      date: formattedDate,
      weatherType: parkstatus.weatherType,
    });

    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "weatherType" ? parseInt(value, 10) : value,
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    try {
      axios.put(
        `https://themepark-backend.onrender.com/parkstatus/${formData.parkStatusID}`,
        formData
      );
      fetchParkStatus();
      closeModal();
    } catch (error) {
      console.error("error saving parkstatus");
    }
  };

  return (
    <>
      <AdminHeader />
      <div className="dataentryformcontainer">
        <h1>Add Park Operating Day</h1>
        <form onSubmit={handleSubmit}>
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={newParkStatus.date}
            onChange={handleChange}
            required
          />

          <label>Weather Type</label>
          <select
            name="weatherType"
            value={newParkStatus.weatherType}
            onChange={handleChange}
            required
          >
            <option value="">Select Weather Type</option>
            <option value="0">Fair</option>
            <option value="1">Cloudy</option>
            <option value="2">Rainout</option>
          </select>
          <button type="submit">Submit</button>
        </form>
      </div>
      <h2>Upcoming Park Days</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Weather Type</th>
            <th>Capacity</th>
            <th>Opening Time</th>
            <th>Closing Time</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {parkStatusList &&
            parkStatusList.map((parkstatus) => (
              <tr key={parkstatus.parkStatusID}>
                <td>{formatDate(parkstatus.date)}</td>
                <td style={getWeatherStyle(parkstatus.weatherType)}>
                  {getWeatherDescription(parkstatus.weatherType)}
                </td>
                <td>{parkstatus.capacity}</td>
                <td style={getTimeStyle(parkstatus.openingTime)}>
                  {getOpenTime(parkstatus.openingTime)}
                </td>
                <td style={getTimeStyle(parkstatus.closingTime)}>
                  {getCloseTime(parkstatus.closingTime)}
                </td>
                <td>
                  <button
                    onClick={() => openModal(parkstatus)}
                    className="edit-button"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Park Status Modal"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Edit Park Status</h2>
        <form onSubmit={handleUpdate}>
          <label>
            Date:
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Weather:
            <select
              name="weatherType"
              value={formData.weatherType}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Weather Type</option>
              <option value="0">Fair</option>
              <option value="1">Cloudy</option>
              <option value="2">Rainout</option>
            </select>
          </label>
          <button type="submit">Update Park Day</button>
          <button type="button" onClick={closeModal}>
            Cancel
          </button>
        </form>
      </Modal>
    </>
  );
};
export default ParkStatusForm;
