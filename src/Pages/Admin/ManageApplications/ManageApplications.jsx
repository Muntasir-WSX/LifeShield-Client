import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { 
  XCircle, 
  Info, 
  CheckCircle, 
  Trash2, 
  Clock, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";
import useAxiosSecure from "../../../Hooks/UseAxiosSecure";
import Loading from "../../../SharedComponents/Loading/Loading";
import { Helmet } from "react-helmet-async";

const ManageApplications = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedApp, setSelectedApp] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5; 
  const { data: { result: applications = [], count = 0 } = {}, isLoading, refetch: refetchApps } = useQuery({
    queryKey: ["admin-applications", currentPage],
    queryFn: async () => {
      const res = await axiosSecure.get(`/all-applications?page=${currentPage}&size=${itemsPerPage}`);
      return res.data;
    },
  });

 
  const { data: agents = [] } = useQuery({
    queryKey: ["all-agents"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users/agents");
      return res.data;
    },
  });

  const totalPages = Math.ceil(count / itemsPerPage);
  const pages = [...Array(totalPages).keys()];

  const handleAction = (appId, action) => {
    Swal.fire({
      title: `Confirm ${action}?`,
      text: `Do you want to mark this application as ${action.toLowerCase()}?`,
      icon: action === "Approved" ? "question" : "warning",
      showCancelButton: true,
      confirmButtonColor: action === "Approved" ? "#00332c" : "#d33",
      confirmButtonText: `Yes, ${action}!`,
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.patch(`/applications/status/${appId}`, { status: action })
          .then((res) => {
            if (res.data.modifiedCount > 0) {
              refetchApps();
              Swal.fire("Updated!", `Application has been ${action}`, "success");
            }
          });
      }
    });
  };

  const handleAssignAgent = (appId, agent) => {
    const [agentEmail, agentName] = agent.split("|");
    axiosSecure.patch(`/applications/assign/${appId}`, {
      agentEmail,
      agentName,
      status: "Assigned",
    }).then((res) => {
      if (res.data.modifiedCount > 0) {
        refetchApps();
        Swal.fire("Assigned!", `Policy assigned to ${agentName}`, "success");
      }
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently remove the application!",
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/applications/${id}`).then((res) => {
          if (res.data.deletedCount > 0) {
            refetchApps();
            Swal.fire("Deleted!", "Application removed.", "success");
          }
        });
      }
    });
  };

  if (isLoading) return <Loading />;

  return (
    <div className="p-6 space-y-6">
        <Helmet>
                    <title> Manage All Applications | Life Shield - Secure Your Tomorrow</title>
                    <meta name="description" content="Welcome to Life Shield. Explore our popular insurance policies, meet our expert agents, and stay updated with our latest health and life articles." />
            </Helmet>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#00332c]">Manage Applications</h2>
          <p className="text-sm text-gray-500">Review and assign agents to policy requests</p>
        </div>
        <div className="bg-green-50 text-[#00332c] px-4 py-2 rounded-full text-xs font-bold border border-green-100">
          Total Pending/Process: {count}
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-100">
        <table className="table w-full">
          <thead className="bg-gray-50 text-gray-600 uppercase text-[11px] tracking-wider">
            <tr>
              <th className="py-4 px-6">Applicant</th>
              <th>Policy Name</th>
              <th>Status</th>
              <th>Management Flow</th>
              <th className="text-right px-8">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-20 text-gray-400">No applications found.</td>
              </tr>
            ) : (
              applications.map((app) => (
                <tr key={app._id} className="hover:bg-gray-50/50 border-b last:border-0 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-bold text-[#00332c]">{app.applicantName}</div>
                    <div className="text-[11px] opacity-60 font-medium">{app.applicantEmail}</div>
                  </td>
                  <td className="font-medium text-gray-700 text-sm">{app.policyTitle}</td>
                  <td>
                    <span className={`badge badge-sm font-bold p-3 border-none shadow-sm uppercase text-[10px] ${
                      app.status === "Approved" ? "bg-emerald-100 text-emerald-700" : 
                      app.status === "Assigned" ? "bg-blue-100 text-blue-700" : 
                      app.status === "Rejected" ? "bg-red-100 text-red-700" : 
                      "bg-orange-100 text-orange-700"
                    }`}>
                      {app.status || "Pending"}
                    </span>
                  </td>
                  <td>
                    {app.status === "Approved" && !app.agentEmail ? (
                      <select
                        className="select select-bordered select-xs w-full max-w-40 bg-blue-50 border-blue-200 rounded-lg focus:outline-[#00332c] font-bold text-[#00332c]"
                        onChange={(e) => handleAssignAgent(app._id, e.target.value)}
                        defaultValue=""
                      >
                        <option value="" disabled>Select Agent</option>
                        {agents.map((agent) => (
                          <option key={agent._id} value={`${agent.email}|${agent.name}`}>
                            {agent.name}
                          </option>
                        ))}
                      </select>
                    ) : app.status === "Assigned" || app.agentEmail ? (
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-blue-600 uppercase">Assigned Agent</span>
                        <span className="text-xs text-gray-700 font-bold">{app.agentName}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-orange-600 font-bold text-xs animate-pulse">
                        <Clock size={12}/> Review Needed
                      </div>
                    )}
                  </td>
                  <td className="text-right px-6">
                    <div className="flex justify-end gap-2">
                      {app.status === "Awaiting Approval" && (
                        <>
                          <button onClick={() => handleAction(app._id, "Approved")} className="btn btn-square btn-xs bg-green-500 text-white hover:bg-green-600 border-none shadow-sm">
                            <CheckCircle size={14} />
                          </button>
                          <button onClick={() => handleAction(app._id, "Rejected")} className="btn btn-square btn-xs bg-red-500 text-white hover:bg-red-600 border-none shadow-sm">
                            <XCircle size={14} />
                          </button>
                        </>
                      )}
                      <button onClick={() => { setSelectedApp(app); document.getElementById("admin_details_modal").showModal(); }} className="btn btn-square btn-xs bg-blue-50 text-blue-600 border-none hover:bg-blue-100">
                        <Info size={14} />
                      </button>
                      <button onClick={() => handleDelete(app._id)} className="btn btn-square btn-xs bg-gray-100 text-gray-500 border-none hover:bg-red-50 hover:text-red-500 transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- PAGINATION CONTROLS (Consistent Style) --- */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className="btn btn-sm bg-white border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronLeft size={16} />
          </button>

          {pages.map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`btn btn-sm border-none transition-all ${
                currentPage === page
                  ? "bg-[#00332c] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {page + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
            disabled={currentPage === totalPages - 1}
            className="btn btn-sm bg-white border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* --- Details Modal (Consistent) --- */}
      <dialog id="admin_details_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box max-w-lg bg-white rounded-3xl p-0 overflow-hidden shadow-2xl">
          <div className="bg-[#00332c] p-6 text-white text-center">
            <h3 className="font-black text-xl">Applicant Submission</h3>
            <p className="text-xs opacity-70">Case ID: {selectedApp?._id?.slice(-8)}</p>
          </div>
          <div className="p-8 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <p className="text-[10px] uppercase font-bold text-gray-400">Nominee Name</p>
                <p className="font-bold text-[#00332c] text-sm">{selectedApp?.nomineeName}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <p className="text-[10px] uppercase font-bold text-gray-400">Relation</p>
                <p className="font-bold text-[#00332c] text-sm">{selectedApp?.relation || "N/A"}</p>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Permanent Address</p>
              <p className="text-sm text-gray-700 leading-relaxed">{selectedApp?.address || "No address provided"}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-xl border border-red-100">
              <p className="text-[10px] uppercase font-bold text-red-600 mb-1">Health Disclosure</p>
              <p className="text-sm text-red-800 italic">"{selectedApp?.healthDisclosure || "None"}"</p>
            </div>
            <form method="dialog">
              <button className="btn w-full bg-[#00332c] text-white border-none rounded-xl mt-4">Close Review</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default ManageApplications;