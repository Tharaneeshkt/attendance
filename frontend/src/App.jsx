import { useEffect, useState } from "react";
import "./App.css";

function App() {

  const [students, setStudents] = useState([]);

  // useEffect calls backend
  useEffect(() => {
    getStudents();
  }, []);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // Calls backend and gets data
  const getStudents = async () => {
    try {

      // Fetch students only
      const studentsRes = await fetch(
        "http://localhost:3000/students"
      );

      const studentsData = await studentsRes.json();

      // Temporary empty attendance array
      const attendanceData = [];

      const attendanceMap = {};

      attendanceData.forEach(record => {
        const sId = record.studentId._id || record.studentId;
        attendanceMap[sId] = record.status;
      });

      const updatedStudents = studentsData.map(student => ({
        ...student,
        attendance: attendanceMap[student._id] || ""
      }));

      setStudents(updatedStudents);

    } catch (err) {
      console.log("Error fetching data:", err);
    }
  };

  // Save attendance in MongoDB
  const saveAttendance = async (
    studentId,
    status
  ) => {

    try {

      await fetch(
        "http://localhost:3000/attendance",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({

            studentId,

            status,

            date: new Date()
              .toISOString()
              .split("T")[0]

          })
        }
      );

      console.log(
        "Attendance Saved"
      );

    }
    catch (err) {

      console.log(
        "Error saving attendance:",
        err
      );

    }

  };

  // Update UI immediately
  const markAttendance = (
    id,
    status
  ) => {

    setStudents(
      students.map(student =>
        student._id === id
          ? {
              ...student,
              attendance: status
            }
          : student
      )
    );

  };

  // Present count
  const presentCount =
    students.filter(
      student =>
        student.attendance === "P"
    ).length;

  // Absent count
  const absentCount =
    students.filter(
      student =>
        student.attendance === "A"
    ).length;

  // Reset button
  const resetAttendance = () => {

    setStudents(
      students.map(student => ({
        ...student,
        attendance: ""
      }))
    );

  };

  return (

    <div className="container">

      <h1>
        Attendance Management System
      </h1>

      <div className="summary">

        <h3>
          Total Present :
          {" "}
          {presentCount}
        </h3>

        <h3>
          Total Absent :
          {" "}
          {absentCount}
        </h3>

        <button
          onClick={resetAttendance}
        >
          Reset All
        </button>

      </div>

      <table>

        <thead>

          <tr>

            <th>
              Roll No
            </th>

            <th>
              Name
            </th>

            <th>
              Actions
            </th>

            <th>
              Status
            </th>

          </tr>

        </thead>

        <tbody>

          {
            students.length === 0
              ? (
                <tr>

                  <td
                    colSpan="4"
                    style={{
                      textAlign: "center"
                    }}
                  >
                    No Students Found
                  </td>

                </tr>
              )
              : (
                students.map(student => (

                  <tr
                    key={student._id}
                  >

                    <td>
                      {student.rollNo}
                    </td>

                    <td>
                      {student.name}
                    </td>

                    <td>

                      <button

                        onClick={() => {

                          markAttendance(
                            student._id,
                            "P"
                          );

                          saveAttendance(
                            student._id,
                            "P"
                          );

                        }}

                      >
                        P
                      </button>

                      <button

                        onClick={() => {

                          markAttendance(
                            student._id,
                            "A"
                          );

                          saveAttendance(
                            student._id,
                            "A"
                          );

                        }}

                      >
                        A
                      </button>

                    </td>

                    <td>

                      {
                        student.attendance
                        || "-"
                      }

                    </td>

                  </tr>

                ))
              )
          }

        </tbody>

      </table>

    </div>

  );
}

export default App;