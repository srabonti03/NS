import React, { useEffect, useState } from "react";
import Loading from "../Component/Loading";
import axios from "axios";
import { FiCheck, FiX, FiSlash, FiUnlock, FiSearch } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const FacultyList = () => {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const norm = (s) => (s ? String(s).toLowerCase() : "");

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/admin/teachers/all", {
        withCredentials: true,
      });
      const sorted = sortTeachers(res.data);
      setTeachers(sorted);
      setFilteredTeachers(sorted);
    } catch (err) {
      toast.error("Error fetching teachers");
      console.error("Error fetching teachers:", err);
    } finally {
      setLoading(false);
    }
  };

  const sortTeachers = (list) => {
    const pending = list
      .filter((t) => norm(t.status) === "pending" || norm(t.status) === "all")
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const accepted = list
      .filter((t) => norm(t.status) === "accepted")
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    const others = list
      .filter((t) => !["pending", "all", "accepted"].includes(norm(t.status)))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return [...pending, ...accepted, ...others];
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredTeachers(teachers);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = teachers.filter(
        (teacher) =>
          norm(teacher.firstName).includes(query) ||
          norm(teacher.lastName).includes(query) ||
          norm(teacher.email).includes(query)
      );
      setFilteredTeachers(filtered);
    }
  }, [searchQuery, teachers]);

  const handleApprove = async (id) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/admin/teachers/${id}/approve`,
        {},
        { withCredentials: true }
      );
      toast.success("Teacher approved successfully!");
    } catch (e) {
      toast.error("Failed to approve teacher");
      console.error("Approve error:", e);
    } finally {
      fetchTeachers();
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/admin/teachers/${id}/reject`,
        { withCredentials: true }
      );
      toast.info("Teacher rejected");
    } catch (e) {
      toast.error("Failed to reject teacher");
      console.error("Reject error:", e);
    } finally {
      fetchTeachers();
    }
  };

  const handleToggle = async (id, enabled) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/admin/teachers/${id}/status`,
        { enabled },
        { withCredentials: true }
      );
      toast.success(`Teacher ${enabled ? "enabled" : "disabled"} successfully`);
    } catch (e) {
      toast.error(`Failed to ${enabled ? "enable" : "disable"} teacher`);
      console.error("Toggle status error:", e);
    } finally {
      fetchTeachers();
    }
  };

  const handleNavigateToFaculty = (id) => {
    navigate(`/faculty/${id}`);
  };

  if (loading) return <Loading />;

  return (
    <div className="flex justify-center mt-10 px-2 sm:px-4">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="w-full max-w-5xl rounded-lg p-4 sm:p-6 min-h-[85vh]">
        <div className="flex justify-center mb-10">
          <div className="relative w-full max-w-md">
            <FiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-textSubtle" />
            <input
              type="text"
              placeholder="Search faculty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-borderSubtle bg-card text-textMain placeholder:text-textSubtle shadow focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm sm:text-base transition duration-DEFAULT"
            />
          </div>
        </div>

        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-6 text-center text-textMain">
          Faculty List
        </h2>

        {filteredTeachers.length === 0 ? (
          <p className="text-sm sm:text-base md:text-base text-center text-textSubtle">
            No faculty members found.
          </p>
        ) : (
          <table className="w-full text-left border-collapse table-auto break-all text-sm sm:text-base md:text-base">
            <thead>
              <tr className="bg-card">
                <th className="py-2 px-2 hidden lg:table-cell break-words text-xs sm:text-sm md:text-base text-textMain">
                  Avatar
                </th>
                <th className="py-2 px-2 break-words text-xs sm:text-sm md:text-base text-textMain">
                  Name
                </th>
                <th className="py-2 px-2 break-words text-xs sm:text-sm md:text-base text-textMain">
                  Email
                </th>
                <th className="py-2 px-2 hidden md:table-cell break-words text-xs sm:text-sm md:text-base text-textMain">
                  Status
                </th>
                <th className="py-2 px-2 break-words text-xs sm:text-sm md:text-base text-textMain">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTeachers.map((teacher) => {
                const status = norm(teacher.status);

                const showAcceptReject = status === "pending" || status === "all";
                const isAccepted = status === "accepted";
                const isDisabledByFlag = isAccepted && !teacher.isEnabled;
                const canDisable = isAccepted && teacher.isEnabled;
                const canEnable = isDisabledByFlag || status === "disabled";
                const isRejected = status === "rejected";
                const avatarSrc = teacher.avatar || "Fallback/avatar.png";

                return (
                  <tr
                    key={teacher.id}
                    className={`transition-colors duration-200 ${
                      isRejected
                        ? "bg-gray-800 opacity-60 hover:opacity-80"
                        : "hover:bg-cardHover"
                    }`}
                  >
                    <td
                      className="py-2 px-2 hidden lg:table-cell break-words cursor-pointer"
                      onClick={() => handleNavigateToFaculty(teacher.id)}
                    >
                      <img
                        src={avatarSrc}
                        alt="avatar"
                        className="w-8 sm:w-10 h-8 sm:h-10 rounded-full object-cover border border-borderSubtle"
                      />
                    </td>
                    <td
                      className="py-2 px-2 break-words text-textMain cursor-pointer"
                      onClick={() => handleNavigateToFaculty(teacher.id)}
                    >
                      {teacher.firstName} {teacher.lastName}
                    </td>
                    <td className="py-2 px-2 break-words text-textMain">
                      {teacher.email}
                    </td>
                    <td className="py-2 px-2 capitalize hidden md:table-cell break-words text-textMain">
                      {teacher.status}
                      {isAccepted && (
                        <span className="ml-1 text-xs sm:text-sm opacity-80">
                          ({teacher.isEnabled ? "enabled" : "disabled"})
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-2 space-x-2 break-words">
                      <div className="hidden md:flex space-x-2 flex-wrap">
                        {showAcceptReject && (
                          <>
                            <button
                              onClick={() => handleApprove(teacher.id)}
                              className="bg-btn text-textMain px-2 py-1 rounded hover:bg-btnHover transition-colors duration-200 break-words text-xs sm:text-sm"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleReject(teacher.id)}
                              className="bg-red-500 text-textMain px-2 py-1 rounded hover:bg-red-600 transition-colors duration-200 break-words text-xs sm:text-sm"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {canDisable && (
                          <button
                            onClick={() => handleToggle(teacher.id, false)}
                            className="bg-red-500 text-textMain px-2 py-1 rounded hover:bg-red-600 transition-colors duration-200 break-words text-xs sm:text-sm"
                          >
                            Disable
                          </button>
                        )}
                        {canEnable && (
                          <button
                            onClick={() => handleToggle(teacher.id, true)}
                            className="bg-btn text-textMain px-2 py-1 rounded hover:bg-btnHover transition-colors duration-200 break-words text-xs sm:text-sm"
                          >
                            Enable
                          </button>
                        )}
                      </div>

                      <div className="flex md:hidden flex-wrap gap-2 text-base sm:text-lg">
                        {showAcceptReject && (
                          <>
                            <FiCheck
                              onClick={() => handleApprove(teacher.id)}
                              className="text-green-500 cursor-pointer hover:scale-110 transition-transform"
                            />
                            <FiX
                              onClick={() => handleReject(teacher.id)}
                              className="text-red-500 cursor-pointer hover:scale-110 transition-transform"
                            />
                          </>
                        )}
                        {canDisable && (
                          <FiSlash
                            onClick={() => handleToggle(teacher.id, false)}
                            className="text-red-500 cursor-pointer hover:scale-110 transition-transform"
                          />
                        )}
                        {canEnable && (
                          <FiUnlock
                            onClick={() => handleToggle(teacher.id, true)}
                            className="text-blue-500 cursor-pointer hover:scale-110 transition-transform"
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default FacultyList;
