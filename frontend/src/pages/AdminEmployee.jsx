import { useEffect, useRef, useState } from "react";
import AdminHeader from "../components/adminHeader";
import { Input, InputDialog } from "../components/dasboard";
import "./adminEmployees.css";
import axios from "axios";

export default function AdminEmployee() {
  const [values, setValues] = useState({
    Ssn: 0,
    Fname: "",
    Minitial: "",
    Lname: "",
    Age: NaN,
    Dateofbirth: "",
    Phonenumber: "",
    Address: "",
    City: "",
    State: "",
    Zipcode: NaN,
    Hourlypay: "",
  });
  const [employeeList, setEmployeeList] = useState([]);
  const [deleteState, setDeleteState] = useState(false);
  const [employeeData, setEmployeeData] = useState([]);
  const modalRef = useRef(null);

  const handleChildData = (dataObj) => {
    setValues({ ...values, ...dataObj });
  };

  const postData = async (e) => {
    e.preventDefault();
    try {
      const request = await axios.post(
        "http://localhost:3000/employee/create",
        values
      );
      alert(request.data);
      await getEmployees();
    } catch (err) {
      if (err) alert(err);
    }
  };

  const deleteRow = (idVal) => {
    axios
      .delete(`http://localhost:3000/employee/delete/${idVal}`)
      .then((res) => {
        alert(res.data);
        setEmployeeList(
          employeeList.filter((value) => {
            return value.idVal !== idVal;
          })
        );
        //change delete state variable everytime delete button is clicked
        deleteState == false ? setDeleteState(true) : setDeleteState(false);
      })
      .catch((err) => console.error(err));
  };

  const getEmployees = () => {
    axios
      .get(`https://themepark-server.vercel.app/employee/read`)
      .then((res) => setEmployeeList(res.data.result))
      .catch((err) => console.error(err));
  };

  //renders employee list after delete button click
  useEffect(() => {
    getEmployees();
  }, [deleteState]);

  const getEmployeeData = (ssn) => {
    axios
      .get(`http://localhost:3000/employee/read/${ssn}`)
      .then((res) => {
        setEmployeeData({ ...employeeData, ...res.data.result });
        setValues({ ...values, ...res.data.result[0] });
        const modal = modalRef.current;
        modal.showModal();
      })
      .catch((err) => console.error(err));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    axios
      .put("http://localhost:3000/employee/update", values)
      .then((res) => alert(res.data))
      .catch((err) => console.log(err));
    setDeleteState(deleteState == true ? false : true);
  };

  return (
    <>
      <AdminHeader />
      <dialog ref={modalRef}>
        <form>
          <InputDialog
            inputNaming={"empSSN"}
            inputText={"SSN"}
            inputType={"number"}
            value={values.Ssn}
            readOnly
            onChange={(e) => setValues({ ...values, Ssn: e.target.value })}
          />
          <InputDialog
            inputNaming={"empFname"}
            inputText={"First Name"}
            inputType={"text"}
            value={values.Fname}
            onChange={(e) => setValues({ ...values, Fname: e.target.value })}
          />
          <InputDialog
            inputNaming={"empMinitial"}
            inputText={"Middle Initial"}
            inputType={"text"}
            maxLength={1}
            value={values.Minitial}
            onChange={(e) => setValues({ ...values, Minitial: e.target.value })}
          />
          <InputDialog
            inputNaming={"empLname"}
            inputText={"Last Name"}
            inputType={"text"}
            maxLength={30}
            value={values.Lname}
            onChange={(e) => setValues({ ...values, Lname: e.target.value })}
          />
          <InputDialog
            inputNaming={"empAge"}
            inputType={"number"}
            inputText={"Age"}
            value={values.Age}
            onChange={(e) => setValues({ ...values, Age: e.target.value })}
          />
          <InputDialog
            inputNaming={"empDOB"}
            inputText={"Date of Birth"}
            inputType={"date"}
            value={values.Dateofbirth}
            onChange={(e) =>
              setValues({ ...values, Dateofbirth: e.target.value })
            }
          />
          <InputDialog
            inputText={"Phone Number"}
            inputNaming={"phoneNumber"}
            inputType={"text"}
            maxLength={20}
            value={values.Phonenumber}
            onChange={(e) =>
              setValues({ ...values, Phonenumber: e.target.value })
            }
          />
          <InputDialog
            inputNaming={"address"}
            inputText={"Address"}
            inputType={"text"}
            maxLength={50}
            value={values.Address}
            onChange={(e) => setValues({ ...values, Address: e.target.value })}
          />
          <InputDialog
            inputNaming={"city"}
            inputText={"City"}
            inputType={"text"}
            maxLength={30}
            value={values.City}
            onChange={(e) => setValues({ ...values, City: e.target.value })}
          />
          <InputDialog
            inputNaming={"state"}
            inputText={"State"}
            inputType={"text"}
            maxLength={2}
            value={values.State}
            onChange={(e) => setValues({ ...values, State: e.target.value })}
          />
          <InputDialog
            inputNaming={"zipCode"}
            inputText={"Zip Code"}
            inputType={"number"}
            value={values.Zipcode}
            onChange={(e) => setValues({ ...values, Zipcode: e.target.value })}
          />
          <InputDialog
            inputNaming={"hourly"}
            inputText={"Hourly Pay"}
            inputType={"number"}
            value={values.Hourlypay}
            onChange={(e) =>
              setValues({ ...values, Hourlypay: e.target.value })
            }
          />

          <button type="submit" onClick={handleUpdate}>
            Update
          </button>
          <button type="button" onClick={() => modalRef.current.close()}>
            Close
          </button>
        </form>
      </dialog>
      <table>
        <thead>
          <tr>
            <th>SSN</th>
            <th>First Name</th>
            <th>M Initial</th>
            <th>Last Name</th>
            <th>Age</th>
            <th>DOB</th>
            <th>Phone Number</th>
            <th>Address</th>
            <th>City</th>
            <th>State</th>
            <th>Zip Code</th>
            <th>Dept ID</th>
            <th>Hourly</th>
            <th>Position</th>
            <th>Benefits</th>
            <th>Supervisor ID</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>

        {employeeList.map((val, key) => {
          return (
            <>
              <tbody key={key}>
                <tr>
                  <td>{val.Ssn}</td>
                  <td>{val.Fname}</td>
                  <td>{val.Minitial}</td>
                  <td>{val.Lname}</td>
                  <td>{val.Age}</td>
                  <td>{val.DOB}</td>
                  <td>{val.Phonenumber}</td>
                  <td>{val.Address}</td>
                  <td>{val.City}</td>
                  <td>{val.State}</td>
                  <td>{val.Zipcode}</td>
                  <td>{val.Departmentid}</td>
                  <td>{val.Hourlypay}</td>
                  <td>{val.Position}</td>
                  <td>{val.Benefits}</td>
                  <td>{val.Supervisorssn}</td>
                  <td>{val.EmployeeEmail}</td>
                  <div className="table-btn-container">
                    <button onClick={() => deleteRow(val.Ssn)}>Delete</button>
                    <button onClick={() => getEmployeeData(val.Ssn)}>
                      Edit
                    </button>
                  </div>
                </tr>
              </tbody>
            </>
          );
        })}
      </table>
      <div className="employee-card">
        <h1>Add Employee</h1>
        <form action="" className="employee-form" onSubmit={postData}>
          <Input
            inputNaming={"empSSN"}
            inputText={"SSN"}
            inputType={"number"}
            handleInputChange={handleChildData}
          />
          <Input
            inputNaming={"empFname"}
            inputText={"First Name"}
            inputType={"text"}
            handleInputChange={handleChildData}
          />
          <Input
            inputNaming={"empMinitial"}
            inputText={"Middle Initial"}
            inputType={"text"}
            maxLength={1}
            handleInputChange={handleChildData}
          />
          <Input
            inputNaming={"empLname"}
            inputText={"Last Name"}
            inputType={"text"}
            maxLength={30}
            handleInputChange={handleChildData}
          />
          <Input
            inputNaming={"empAge"}
            inputType={"number"}
            inputText={"Age"}
            handleInputChange={handleChildData}
          />

          <Input
            inputNaming={"empDOB"}
            inputText={"Date of Birth"}
            inputType={"date"}
            handleInputChange={handleChildData}
          />

          <Input
            inputText={"Phone Number"}
            inputNaming={"phoneNumber"}
            inputType={"text"}
            maxLength={20}
            handleInputChange={handleChildData}
          />
          <Input
            inputNaming={"address"}
            inputText={"Address"}
            inputType={"text"}
            maxLength={50}
            handleInputChange={handleChildData}
          />
          <Input
            inputNaming={"city"}
            inputText={"City"}
            inputType={"text"}
            maxLength={30}
            handleInputChange={handleChildData}
          />

          <Input
            inputNaming={"state"}
            inputText={"State"}
            inputType={"text"}
            maxLength={2}
            handleInputChange={handleChildData}
          />

          <Input
            inputNaming={"zipCode"}
            inputText={"Zip Code"}
            inputType={"number"}
            handleInputChange={handleChildData}
          />

          <Input
            inputNaming={"hourly"}
            inputText={"Hourly Pay"}
            inputType={"number"}
            handleInputChange={handleChildData}
          />

          <button type="submit">Submit</button>
        </form>
      </div>
    </>
  );
}
