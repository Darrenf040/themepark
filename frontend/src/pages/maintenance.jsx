import { useEffect, useRef, useState } from "react";
import AdminHeader from "../components/adminHeader";
import { Input, InputDialog } from "../components/dasboard";
import "./adminEmployees.css";
import axios from "axios";

export default function maintenance() {
  const [maintData, setmaintData] = useEffect({
    maintenanceOpenDate: "",
    maintenanceCloseDate: "",
    rideID: "",
  });

  const [rideList, setRideList] = useEffect(null);
  const [techList, setTechList] = useEffect(null);
  const [maintDataList, setMaintDataList] = useEffect(null);
  const [deleteState, setDeleteState] = useEffect(null);

  return (
    <>
      <AdminHeader />
    </>
  );
}
