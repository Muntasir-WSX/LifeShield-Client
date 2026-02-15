import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { XCircle, Info, UserCheck } from "lucide-react";
import useAxiosSecure from "../../../Hooks/UseAxiosSecure";

const ManageApplications = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedApp, setSelectedApp] = useState(null); // মোডালের জন্য

  const { data: applications = [], refetch: refetchApps } = useQuery({
    queryKey: ["admin-applications"],
    queryFn: async () => {
      const res = await axiosSecure.get("/all-applications");
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

  // স্ট্যাটাস পরিবর্তন করার ফাংশন (Reject এর জন্য)
  const handleStatusChange = (appId, newStatus) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You want to change status to ${newStatus}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, do it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.patch(`/applications/status/${appId}`, { status: newStatus })
          .then((res) => {
            if (res.data.modifiedCount > 0) {
              refetchApps();
              Swal.fire("Updated!", `Status is now ${newStatus}`, "success");
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
      })
      .then((res) => {
        if (res.data.modifiedCount > 0) {
          refetchApps();
          Swal.fire("Assigned!", `Policy assigned to ${agentName}`, "success");
        }
      });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-[#00332c] mb-6">Manage Insurance Applications</h2>

      <div className="overflow-x-auto bg-white rounded-3xl shadow-sm border border-gray-100">
        <table className="table w-full">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th>Applicant</th>
              <th>Policy Name</th>
              <th>Status</th>
              <th>Assign Agent</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app._id} className="hover:bg-gray-50/50 border-b">
                <td>
                  <div className="font-bold">{app.applicantName}</div>
                  <div className="text-xs opacity-50">{app.applicantEmail}</div>
                </td>
                <td className="font-medium">{app.policyTitle}</td>
                <td>
                  <span className={`badge badge-sm font-bold p-3 ${
                    app.status === "Paid" ? "badge-success text-white" : 
                    app.status === "Assigned" ? "badge-info text-white" : 
                    app.status === "Rejected" ? "badge-error text-white" : "badge-warning"
                  }`}>
                    {app.status || "Pending"}
                  </span>
                </td>
                <td>
                  {["Pending", "Assigned"].includes(app.status || "Pending") ? (
                    <select
                      className="select select-bordered select-sm w-full max-w-xs"
                      onChange={(e) => handleAssignAgent(app._id, e.target.value)}
                      defaultValue={app.agentEmail ? `${app.agentEmail}|${app.agentName}` : ""}
                    >
                      <option value="" disabled>Select Agent</option>
                      {agents.map((agent) => (
                        <option key={agent._id} value={`${agent.email}|${agent.name}`}>
                          {agent.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className="text-xs font-bold text-gray-500 italic">Handled by Agent</span>
                  )}
                </td>
                <td className="flex justify-center gap-2">
                  {/* View Details Button */}
                  <button
                    onClick={() => {
                        setSelectedApp(app);
                        document.getElementById("admin_details_modal").showModal();
                    }}
                    className="btn btn-square btn-sm btn-ghost text-blue-500"
                    title="View Details"
                  >
                    <Info size={18} />
                  </button>
                  
                  {/* Reject Button */}
                  {app.status !== "Rejected" && app.status !== "Paid" && (
                    <button
                      onClick={() => handleStatusChange(app._id, "Rejected")}
                      className="btn btn-square btn-sm btn-ghost text-red-500"
                      title="Reject Application"
                    >
                      <XCircle size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- View Details Modal --- */}
      <dialog id="admin_details_modal" className="modal">
        <div className="modal-box max-w-2xl bg-white rounded-3xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-black text-xl text-[#00332c]">Application Full Details</h3>
            <div className="badge badge-outline">{selectedApp?.status}</div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
                <p className="text-xs text-gray-400 uppercase font-bold">Applicant Email</p>
                <p className="font-medium">{selectedApp?.applicantEmail}</p>
            </div>
            <div className="space-y-1">
                <p className="text-xs text-gray-400 uppercase font-bold">Nominee Name</p>
                <p className="font-medium">{selectedApp?.nomineeName} ({selectedApp?.relation || selectedApp?.nomineeRelation})</p>
            </div>
            <div className="space-y-1 md:col-span-2">
                <p className="text-xs text-gray-400 uppercase font-bold">Address</p>
                <p className="font-medium bg-gray-50 p-2 rounded-lg border">{selectedApp?.address}</p>
            </div>
            <div className="space-y-1 md:col-span-2">
                <p className="text-xs text-red-400 uppercase font-bold">Health Disclosure</p>
                <p className="font-medium text-red-700 bg-red-50 p-3 rounded-lg border border-red-100 italic">
                    "{selectedApp?.healthDisclosure}"
                </p>
            </div>
          </div>

          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4">✕</button>
              <button className="btn bg-[#00332c] text-white rounded-xl">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default ManageApplications;