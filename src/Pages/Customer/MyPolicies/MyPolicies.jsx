import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Star, MessageSquare, CheckCircle, Info, Clock, ShieldCheck } from "lucide-react";
import Swal from "sweetalert2";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/UseAxiosSecure";

const MyPolicies = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [detailsPolicy, setDetailsPolicy] = useState(null);

  const {
    data: myAppliedPolicies = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["my-policies", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/applied-policies/${user?.email}`);
      return res.data;
    },
  });

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const rating = form.rating.value;
    const feedback = form.feedback.value;

    const reviewData = {
      userName: user?.displayName,
      userPhoto: user?.photoURL,
      policyTitle: selectedPolicy?.policyTitle,
      rating: parseInt(rating),
      feedback,
      date: new Date().toISOString(),
    };

    const res = await axiosSecure.post("/reviews", reviewData);
    if (res.data.insertedId) {
      Swal.fire({
        title: "Success!",
        text: "Thank you for your feedback!",
        icon: "success",
        confirmButtonColor: "#10B981",
      });
      document.getElementById("review-modal").close();
      form.reset();
    }
  };

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <span className="loading loading-spinner loading-lg text-[#00332c]"></span>
        <p className="mt-4 font-bold text-[#00332c]">Loading your policies...</p>
      </div>
    );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h3 className="text-2xl font-black text-[#00332c]">My Insurance Journey</h3>
          <p className="text-gray-500 text-sm">Track your applications and active policies</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full font-bold text-sm border border-green-100">
          <ShieldCheck size={16} />
          Total Policies: {myAppliedPolicies.length}
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
        <table className="table w-full">
          <thead className="bg-gray-50 text-[#00332c] uppercase text-[11px] tracking-wider">
            <tr>
              <th className="py-4 px-6">Policy Info</th>
              <th>Current Status</th>
              <th>Paid Amount</th>
              <th className="text-right px-6">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {myAppliedPolicies.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-20">
                  <div className="flex flex-col items-center opacity-40">
                    <Info size={48} />
                    <p className="mt-2 font-medium">No policies found.</p>
                  </div>
                </td>
              </tr>
            ) : (
              myAppliedPolicies.map((policy) => (
                <tr key={policy._id} className="hover:bg-gray-50/50 transition-colors border-b last:border-0">
                  <td className="py-4 px-6">
                    <div className="font-bold text-[#00332c]">{policy.policyTitle}</div>
                    <div className="text-[10px] text-gray-400 font-mono">
                      TXN: {policy.transactionId || "Processing..."}
                    </div>
                  </td>

                  <td>
                    <span className={`badge badge-sm font-bold p-3 border-none ${
                      policy.status === "Assigned" ? "bg-blue-100 text-blue-700" :
                      policy.status === "Awaiting Approval" ? "bg-orange-100 text-orange-700 animate-pulse" :
                      policy.status === "Approved" ? "bg-emerald-100 text-emerald-700" :
                      policy.status === "Rejected" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"
                    }`}>
                      {policy.status === "Awaiting Approval" && <Clock size={12} className="mr-1" />}
                      {policy.status || "Paid"}
                    </span>
                  </td>

                  <td>
                    <div className="font-bold text-green-600">
                      ৳{(policy.amount || policy.paidAmount)?.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-gray-400 font-medium">
                      {policy.date ? new Date(policy.date).toLocaleDateString() : "Just Now"}
                    </div>
                  </td>

                  <td className="text-right px-6">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => {
                          setDetailsPolicy(policy);
                          document.getElementById("details-modal").showModal();
                        }}
                        className="btn btn-sm bg-blue-50 text-blue-600 hover:bg-blue-100 border-none rounded-lg gap-1"
                      >
                        <Info size={14} /> Details
                      </button>
                      {policy.status === "Assigned" && (
                        <button
                          onClick={() => {
                            setSelectedPolicy(policy);
                            document.getElementById("review-modal").showModal();
                          }}
                          className="btn btn-sm bg-yellow-400 hover:bg-yellow-500 text-[#00332c] border-none rounded-lg gap-2 font-bold"
                        >
                          <Star size={14} /> Review
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- MODALS --- */}

      {/* Review Modal */}
      <dialog id="review-modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-white rounded-4xl p-6 shadow-2xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-yellow-50 text-yellow-600 rounded-2xl border border-yellow-100">
              <MessageSquare size={24} />
            </div>
            <div>
              <h3 className="font-black text-xl text-[#00332c]">Give Feedback</h3>
              <p className="text-xs text-gray-500 line-clamp-1">Policy: {selectedPolicy?.policyTitle}</p>
            </div>
          </div>

          <form onSubmit={handleReviewSubmit} className="space-y-5">
            <div className="form-control">
              <label className="label font-bold text-gray-700 text-sm">Star Rating</label>
              <div className="rating rating-lg gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <input key={num} type="radio" name="rating" value={num} className="mask mask-star-2 bg-yellow-400" required />
                ))}
              </div>
            </div>
            <div className="form-control">
              <label className="label font-bold text-gray-700 text-sm">Your Experience</label>
              <textarea
                name="feedback"
                className="textarea textarea-bordered h-28 bg-gray-50 focus:outline-green-500 border-gray-200 rounded-xl"
                placeholder="Share your thoughts about our service..."
                required
              ></textarea>
            </div>
            <div className="modal-action">
              <button type="button" onClick={() => document.getElementById("review-modal").close()} className="btn btn-ghost">Cancel</button>
              <button type="submit" className="btn bg-[#00332c] hover:bg-[#00221d] text-white px-8 rounded-xl border-none font-bold">Submit Review</button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop"><button>close</button></form>
      </dialog>

      {/* Details Modal */}
      <dialog id="details-modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-white rounded-4xl p-0 overflow-hidden shadow-2xl max-w-lg">
          <div className="bg-[#00332c] p-6 text-white">
            <h3 className="font-black text-xl">Policy Summary</h3>
            <p className="text-xs opacity-70 truncate">{detailsPolicy?.policyTitle}</p>
          </div>

          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <p className="text-[10px] uppercase font-bold text-gray-400">Nominee</p>
                <p className="font-bold text-[#00332c] truncate">{detailsPolicy?.nomineeName || "N/A"}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <p className="text-[10px] uppercase font-bold text-gray-400">Relation</p>
                <p className="font-bold text-[#00332c] text-sm">{detailsPolicy?.nomineeRelation || detailsPolicy?.relation || "N/A"}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Coverage Type</p>
              <p className="text-sm text-gray-700 font-medium">Standard Life Protection</p>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase font-bold text-blue-600">Assigned Agent</p>
                  <p className="text-sm font-bold text-blue-900">{detailsPolicy?.agentName || "Waiting for admin..."}</p>
                </div>
                {detailsPolicy?.agentEmail && (
                   <div className="badge badge-info text-[10px] text-white">Contacted</div>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-dashed">
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400">Application Status</p>
                <span className={`badge font-bold p-3 mt-1 ${
                    detailsPolicy?.status === 'Rejected' ? 'badge-error text-white' : 'badge-warning'
                }`}>
                    {detailsPolicy?.status || "Processing"}
                </span>
              </div>
              <button onClick={() => document.getElementById("details-modal").close()} className="btn btn-ghost btn-sm font-bold">Close</button>
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop"><button>close</button></form>
      </dialog>
    </div>
  );
};

export default MyPolicies;