import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
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
      Swal.fire("Updated!", "Status and Purchase Count updated.", "success");
    },
  });

  const handleStatusChange = (id, newStatus, policyId) => {
    if (newStatus === "Approved") {
      Swal.fire({
        title: "Are you sure?",
        text: "Approving will increase the policy purchase count!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Approve!",
      }).then((result) => {
        if (result.isConfirmed) {
          statusMutation.mutate({ id, status: newStatus, policyId });
        }
      });
    } else {
      statusMutation.mutate({ id, status: newStatus, policyId });
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center p-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-[#00332c]">
        Assigned Customers
      </h2>

      <div className="overflow-x-auto bg-white rounded-2xl shadow-xl border border-gray-100">
        <table className="table w-full">
          <thead className="bg-[#00332c] text-white">
            <tr>
              <th>Customer Info</th>
              <th>Policy</th>
              <th>Status</th>
              <th>Action</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                <td>
                  <div className="font-bold text-gray-800">
                    {item.applicantName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {item.applicantEmail}
                  </div>
                </td>
                <td className="font-medium text-blue-700">
                  {item.policyTitle}
                </td>
                <td>
                  <select
                    className={`select select-sm select-bordered font-semibold ${
                      item.status === "Approved"
                        ? "text-green-600"
                        : "text-orange-500"
                    }`}
                    defaultValue={item.status}
                    onChange={(e) =>
                      handleStatusChange(
                        item._id,
                        e.target.value,
                        item.policyId,
                      )
                    }
                  >
                    <option value="Paid">Paid (Pending)</option>
                    <option value="Approved">Approve</option>
                    <option value="Rejected">Reject</option>
                  </select>
                </td>
                <td>
                  <span
                    className={`badge badge-sm font-bold ${
                      item.status === "Approved"
                        ? "badge-success"
                        : "badge-ghost"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => {
                      setSelectedCustomer(item);
                      document.getElementById("details_modal").showModal();
                    }}
                    className="btn btn-circle btn-ghost btn-sm text-blue-600 border border-blue-100 hover:bg-blue-50"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Details Modal */}
      <dialog id="details_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-white">
          <h3 className="font-bold text-xl text-[#00332c] border-b pb-2 mb-4">
            Customer Application Details
          </h3>
          {selectedCustomer && (
            <div className="space-y-3 text-gray-700">
              <p>
                <strong>NID:</strong> {selectedCustomer.nid}
              </p>
              <p>
                <strong>Address:</strong> {selectedCustomer.address}
              </p>
              <p>
                <strong>Nominee:</strong> {selectedCustomer.nomineeName} (
                {selectedCustomer.relation})
              </p>
              <p>
                <strong>Coverage Amount:</strong> ৳
                {selectedCustomer.coverageAmount?.toLocaleString("en-BD")}
              </p>
              <p>
                <strong>Monthly Premium:</strong> ৳{selectedCustomer.amount}
              </p>
              <div className="bg-gray-100 p-3 rounded-lg mt-4">
                <p className="text-sm font-bold">Transaction ID:</p>
                <p className="text-xs font-mono break-all text-blue-600">
                  {selectedCustomer.transactionId}
                </p>
              </div>
            </div>
          )}
          <div className="modal-action">
            <form method="dialog">
              <button className="btn bg-[#00332c] text-white hover:bg-black border-none px-8">
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default AssignedCustomers;
