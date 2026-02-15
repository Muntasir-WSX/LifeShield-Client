import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Star, MessageSquare, CheckCircle, Info } from "lucide-react";
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
          <h3 className="text-2xl font-black text-[#00332c]">Active Protection</h3>
          <p className="text-gray-500 text-sm">List of your applied and paid policies</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full font-bold text-sm border border-green-100">
          <CheckCircle size={16} />
          Total Policies: {myAppliedPolicies.length}
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
        <table className="table w-full">
          <thead className="bg-gray-50 text-[#00332c] uppercase text-[11px] tracking-wider">
            <tr>
              <th className="py-4 px-6">Policy Info</th>
              <th>Premium/Amount</th>
              <th className="hidden lg:table-cell">Transaction ID</th>
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
                    <div className="text-xs text-gray-400">
                      Coverage: ৳{policy.coverageAmount?.toLocaleString() || "N/A"}
                    </div>
                  </td>
                  <td>
                    <div className="font-bold text-green-600">
                      ৳{policy.paidAmount || policy.amount}
                    </div>
                    <div className="text-[10px] text-gray-400">
                      {policy.paymentDate ? new Date(policy.paymentDate).toLocaleDateString() : "Pending"}
                    </div>
                  </td>
                  <td className="hidden lg:table-cell font-mono text-xs opacity-60">
                    {policy.transactionId || "N/A"}
                  </td>
                  <td className="text-right px-6">
                    <div className="flex gap-2 justify-end">
                      {/* Details Button */}
                      <button
                        onClick={() => {
                          setDetailsPolicy(policy);
                          document.getElementById("details-modal").showModal();
                        }}
                        className="btn btn-sm bg-blue-50 text-blue-600 hover:bg-blue-100 border-none rounded-lg gap-1"
                      >
                        <Info size={14} /> Details
                      </button>

                      {/* Review Button - Only show if paid */}
                      {policy.status === "Paid" && (
                        <button
                          onClick={() => {
                            setSelectedPolicy(policy);
                            document.getElementById("review-modal").showModal();
                          }}
                          className="btn btn-sm bg-green-500 hover:bg-green-600 text-white border-none rounded-lg gap-2"
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
        <div className="modal-box bg-white rounded-[2rem] p-6 shadow-2xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-yellow-50 text-yellow-600 rounded-2xl border border-yellow-100">
              <MessageSquare size={24} />
            </div>
            <div>
              <h3 className="font-black text-xl text-[#00332c]">Give Feedback</h3>
              <p className="text-xs text-gray-500 line-clamp-1">Reviewing: {selectedPolicy?.policyTitle}</p>
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
                placeholder="How was your experience with this policy?"
                required
              ></textarea>
            </div>
            <div className="modal-action">
              <button type="button" onClick={() => document.getElementById("review-modal").close()} className="btn btn-ghost">Cancel</button>
              <button type="submit" className="btn bg-[#00332c] hover:bg-[#00221d] text-white px-8 rounded-xl border-none">Submit</button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop"><button>close</button></form>
      </dialog>

      {/* Details Modal */}
      <dialog id="details-modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-white rounded-[2rem] p-0 overflow-hidden shadow-2xl max-w-lg">
          <div className="bg-[#00332c] p-6 text-white">
            <h3 className="font-black text-xl">Application Details</h3>
            <p className="text-xs opacity-70">Policy: {detailsPolicy?.policyTitle}</p>
          </div>

          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <p className="text-[10px] uppercase font-bold text-gray-400">Nominee Name</p>
                <p className="font-bold text-[#00332c]">{detailsPolicy?.nomineeName || "N/A"}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <p className="text-[10px] uppercase font-bold text-gray-400">Relation</p>
                {/* relation অথবা nomineeRelation যেটিই থাকুক, কাজ করবে */}
                <p className="font-bold text-[#00332c] text-sm">{detailsPolicy?.nomineeRelation || detailsPolicy?.relation || "N/A"}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Permanent Address</p>
              <p className="text-sm text-gray-700 leading-relaxed">{detailsPolicy?.address || "Address not provided"}</p>
            </div>

            <div className="bg-red-50 p-4 rounded-xl border border-red-100">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <p className="text-[10px] uppercase font-bold text-red-600">Health Disclosure</p>
              </div>
              <p className="text-sm text-red-800 italic">"{detailsPolicy?.healthDisclosure || "No health issues declared"}"</p>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-dashed">
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400">Current Status</p>
                <span className="badge badge-warning font-bold p-3 mt-1">{detailsPolicy?.status || "Pending Review"}</span>
              </div>
              <button onClick={() => document.getElementById("details-modal").close()} className="btn btn-ghost btn-sm">Close</button>
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop"><button>close</button></form>
      </dialog>
    </div>
  );
};

export default MyPolicies;