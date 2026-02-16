import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { Info, CheckCircle, XCircle, Clock } from "lucide-react";
import useAxiosSecure from "../../../Hooks/UseAxiosSecure";
import useAuth from "../../../Hooks/useAuth";

const AssignedCustomers = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const { data: assignments = [], isLoading } = useQuery({
    queryKey: ["agent-assignments", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/agent-applications/${user?.email}`);
      return res.data;
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status, policyId }) => {
      const res = await axiosSecure.patch(`/applications/agent-status/${id}`, {
        status,
        policyId,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["agent-assignments"]);
      Swal.fire({
        title: "Updated!",
        text: "The application status has been locked and updated.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false
      });
    },
  });

  const handleStatusChange = (id, newStatus, policyId) => {
    const actionText = newStatus === "Approved" ? "approve" : "reject";
    
    Swal.fire({
      title: `Confirm ${newStatus}?`,
      text: `Once you ${actionText} this, you cannot change it again!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: newStatus === "Approved" ? "#10B981" : "#EF4444",
      confirmButtonText: `Yes, ${newStatus}!`,
    }).then((result) => {
      if (result.isConfirmed) {
        statusMutation.mutate({ id, status: newStatus, policyId });
      } else {
        // যদি ইউজার ক্যান্সেল করে, তবে রি-রেন্ডার করে ড্রপডাউন আগের অবস্থায় আনা
        queryClient.invalidateQueries(["agent-assignments"]);
      }
    });
  };

  if (isLoading)
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <span className="loading loading-spinner loading-lg text-[#00332c]"></span>
        <p className="text-gray-500 font-medium animate-pulse">Fetching assignments...</p>
      </div>
    );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col">
        <h2 className="text-3xl font-black text-[#00332c]">Assigned Customers</h2>
        <p className="text-gray-500 text-sm">Review and finalize policy applications assigned to you.</p>
      </div>

      <div className="overflow-x-auto bg-white rounded-3xl shadow-sm border border-gray-100">
        <table className="table w-full">
          <thead className="bg-gray-50 text-gray-500 uppercase text-[11px] font-bold tracking-wider">
            <tr>
              <th className="py-5 px-6">Customer Info</th>
              <th>Policy Name</th>
              <th>Decision</th>
              <th>Current Status</th>
              <th className="text-center">Details</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((item) => {
              const isFinalized = item.status === "Approved" || item.status === "Rejected";
              
              return (
                <tr key={item._id} className="hover:bg-gray-50/50 border-b last:border-0 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-bold text-[#00332c]">{item.applicantName}</div>
                    <div className="text-[11px] opacity-60 font-medium tracking-tight">{item.applicantEmail}</div>
                  </td>
                  <td className="font-semibold text-blue-600 text-xs">
                    {item.policyTitle}
                  </td>
                  <td>
                    <select
                      className={`select select-xs select-bordered rounded-lg font-bold transition-all ${
                        item.status === "Approved" ? "bg-green-50 text-green-700 border-green-200" :
                        item.status === "Rejected" ? "bg-red-50 text-red-700 border-red-200" :
                        "bg-orange-50 text-orange-700 border-orange-200"
                      }`}
                      defaultValue={item.status}
                      disabled={isFinalized}
                      onChange={(e) => handleStatusChange(item._id, e.target.value, item.policyId)}
                    >
                      <option value="Paid" disabled={isFinalized}>Reviewing</option>
                      <option value="Approved">Approve</option>
                      <option value="Rejected">Reject</option>
                    </select>
                  </td>
                  <td>
                    <div className={`badge badge-sm font-black p-3 border-none gap-1 ${
                      item.status === "Approved" ? "bg-emerald-100 text-emerald-700" :
                      item.status === "Rejected" ? "bg-red-100 text-red-700" :
                      "bg-orange-100 text-orange-700"
                    }`}>
                      {item.status === "Approved" && <CheckCircle size={12} />}
                      {item.status === "Rejected" && <XCircle size={12} />}
                      {item.status === "Paid" && <Clock size={12} />}
                      {item.status}
                    </div>
                  </td>
                  <td className="text-center">
                    <button
                      onClick={() => {
                        setSelectedCustomer(item);
                        document.getElementById("details_modal").showModal();
                      }}
                      className="btn btn-square btn-ghost btn-sm text-blue-500 hover:bg-blue-50"
                    >
                      <Info size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* --- Details Modal --- */}
      <dialog id="details_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box p-0 bg-white rounded-3xl overflow-hidden shadow-2xl">
          <div className="bg-[#00332c] p-6 text-white">
            <h3 className="font-black text-xl">Customer Profile</h3>
            <p className="text-xs opacity-70">Application ID: {selectedCustomer?._id}</p>
          </div>
          
          <div className="p-8 grid grid-cols-1 gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-xl">
                <p className="text-[10px] font-black text-gray-400 uppercase">NID Number</p>
                <p className="text-sm font-bold text-[#00332c]">{selectedCustomer?.nid}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl">
                <p className="text-[10px] font-black text-gray-400 uppercase">Nominee</p>
                <p className="text-sm font-bold text-[#00332c]">{selectedCustomer?.nomineeName}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Permanent Address</p>
              <p className="text-sm text-gray-600 leading-relaxed font-medium">{selectedCustomer?.address}</p>
            </div>

            <div className="flex justify-between items-center bg-blue-50 p-4 rounded-xl border border-blue-100">
              <div>
                <p className="text-[10px] font-black text-blue-600 uppercase">Monthly Premium</p>
                <p className="text-lg font-black text-blue-900">৳{selectedCustomer?.amount}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-blue-600 uppercase">Coverage</p>
                <p className="text-sm font-bold text-blue-900">৳{selectedCustomer?.coverageAmount?.toLocaleString("en-BD")}</p>
              </div>
            </div>

            <div className="modal-action mt-4">
              <form method="dialog" className="w-full">
                <button className="btn w-full bg-[#00332c] text-white border-none rounded-xl hover:bg-black">
                  Finished Review
                </button>
              </form>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default AssignedCustomers;