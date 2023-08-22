import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./customTable.css";

const CustomTable = () => {
  const [tableData, setTableData] = useState([]);
  const [isUserHaveEditAccess, setIsUserHaveEditAccess] = useState(false);
  const [isUserHaveViewAccess, setIsUserHaveViewAccess] = useState(false);
  const [isUserHaveAddAccess, setIsUserHaveAddAccess] = useState(false);
  const [isUserHaveRemoveAccess, setIsUserHaveRemoveAccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    GetUserAccess();
    getTableData();
  }, []);

  const getTableData = () => {
    fetch("http://localhost:8000/customer")
      .then((res) => {
        if (!res.ok) {
          return false;
        }
        return res.json();
      })
      .then((res) => {
        // sorting data based on the id
        const sortedTableData = res?.sort((a, b) => {
          return a.id - b.id;
        });

        setTableData(sortedTableData);
      });
  };

  const GetUserAccess = () => {
    const userrole =
      sessionStorage.getItem("userrole") != null
        ? sessionStorage.getItem("userrole").toString()
        : "";
    fetch(
      "http://localhost:8000/roleaccess?role=" + userrole + "&menu=customer"
    )
      .then((res) => {
        if (!res.ok) {
          navigate("/");
          return false;
        }
        return res.json();
      })
      .then((res) => {
        console.log(res);
        if (res.length > 0) {
          let userobj = res[0];

          setIsUserHaveViewAccess(true);
          setIsUserHaveEditAccess(userobj.userCanEdit);
          setIsUserHaveAddAccess(userobj.userCanAdd);
          setIsUserHaveRemoveAccess(userobj.userCanDelete);
        } else {
          navigate("/");
          console.log("You are not authorized to access");
        }
      });
  };

  useEffect(() => {
    const filteredTableData = tableData.filter((item) =>
      item.first_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setTableData(filteredTableData);
  }, [searchTerm]);

  const isUserEligibleToEdit =
    isUserHaveAddAccess && isUserHaveEditAccess & isUserHaveRemoveAccess;

  return (
    <table>
      <thead>
        <tr className="search_filter">
          <input
            type="text"
            placeholder="Search by First Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </tr>
        <tr>
          <th>Id</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Access</th>
        </tr>
      </thead>
      <tbody>
        {tableData?.map((items) => {
          return (
            <tr key={items.id}>
              <td data-column="First Name">{items.id}</td>
              <td data-column="Last Name">{items.first_name}</td>
              <td data-column="Job Title">{items.last_name}</td>
              <td data-column="Twitter">
                {isUserEligibleToEdit ? "Editor - Admin" : "Viewer"}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default CustomTable;
