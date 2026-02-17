import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Star,
  MessageSquare,
  Info,
  Clock,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Swal from "sweetalert2";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/UseAxiosSecure";
import Loading from "../../../SharedComponents/Loading/Loading";

const MyPolicies = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [detailsPolicy, setDetailsPolicy] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  const {
    data: { result: myAppliedPolicies = [], count = 0 } = {},
    isLoading,
  } = useQuery({
    queryKey: ["my-policies", user?.email, currentPage],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/applied-policies/${user?.email}?page=${currentPage}&size=${itemsPerPage}`
      );
      return res.data;
    },
  });

  const numberOfPages = Math.ceil(count / itemsPerPage);
  const pages = [...Array(numberOfPages).keys()];

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const rating = form.rating.value;
    const feedback = form.feedback.value;

    const reviewData = {
      name: user?.displayName,
      image: user?.photoURL || "https://i.ibb.co.com/8mX1C9T/user.png",
      policyTitle: selectedPolicy?.policyTitle,
      rating: parseInt(rating),
      message: feedback,
      date: new Date().toISOString(),
    };

    try {
      const res = await axiosSecure.post("/reviews", reviewData);
      if (res.data.insertedId) {
        Swal.fire({
          title: "Success!",
          text: "Thank you for your feedback!",
          icon: "success",
          confirmButtonColor: "#00332c",
        });
        document.getElementById("review-modal").close();
        form.reset();
      }
    } catch (error) {
      console.error("Review submission error", error);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-[#00332c]">My Insurance Journey</h3>
          <p className="text-sm text-gray-500">Track your applications and active policies</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-[#00332c] rounded-full font-bold text-xs border border-green-100">
          <ShieldCheck size={14} />
          Total Policies: {count}
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-100">
        <table className="table w-full">
          <thead className="bg-gray-50">
            <tr className="text-[#00332c] border-b">
              <th className="p-4 text-left">Policy Info</th>
              <th className="p-4 text-left">Current Status</th>
              <th className="p-4 text-left">Paid Amount</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {myAppliedPolicies.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-20 text-gray-400 font-medium">
                  No policy applications found.
                </td>
              </tr>
            ) : (
              myAppliedPolicies.map((policy) => (
                <tr key={policy._id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-gray-700">{policy.policyTitle}</div>
                    <div className="text-[10px] opacity-50 uppercase font-mono">
                      TXN: {policy.transactionId || "Processing..."}
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`flex items-center gap-1 font-bold text-xs uppercase px-2 py-1 rounded-md w-fit ${
                        policy.status === "Approved" || policy.status === "Assigned"
                          ? "bg-green-50 text-green-600"
                          : policy.status === "Rejected"
                          ? "bg-red-50 text-red-600"
                          : "bg-orange-50 text-orange-500"
                      }`}
                    >
                      {policy.status === "Awaiting Approval" && <Clock size={14} className="animate-pulse" />}
                      {policy.status || "Paid"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-[#00332c]">
                      ৳{(policy.amount || policy.paidAmount)?.toLocaleString("en-BD")}
                    </div>
                    <div className="text-[10px] text-gray-400">
                      {policy.date ? new Date(policy.date).toLocaleDateString() : "Just Now"}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => {
                          setDetailsPolicy(policy);
                          document.getElementById("details-modal").showModal();
                        }}
                        className="btn btn-xs bg-gray-100 text-gray-600 hover:bg-gray-200 border-none rounded-lg px-3"
                      >
                        Details
                      </button>
                      {(policy.status === "Approved" || policy.status === "Assigned") && (
                        <button
                          onClick={() => {
                            setSelectedPolicy(policy);
                            document.getElementById("review-modal").showModal();
                          }}
                          className="btn btn-xs bg-yellow-400 hover:bg-yellow-500 text-[#00332c] border-none rounded-lg px-3 font-bold"
                        >
                          <Star size={12} className="mr-1" /> Review
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

      {/* --- PAGINATION CONTROLS (Matched Style) --- */}
      {count > itemsPerPage && (
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
            onClick={() => setCurrentPage(Math.min(numberOfPages - 1, currentPage + 1))}
            disabled={currentPage === numberOfPages - 1}
            className="btn btn-sm bg-white border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* --- MODALS --- */}
      {/* Review Modal */}
      <dialog id="review-modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-white rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-yellow-50 text-yellow-600 rounded-xl border border-yellow-100">
              <MessageSquare size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#00332c]">Give Feedback</h3>
              <p className="text-xs text-gray-500">Policy: {selectedPolicy?.policyTitle}</p>
            </div>
          </div>
          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label font-bold text-gray-700 text-xs uppercase">Star Rating</label>
              <div className="rating rating-md gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <input
                    key={num}
                    type="radio"
                    name="rating"
                    value={num}
                    className="mask mask-star-2 bg-yellow-400"
                    required
                  />
                ))}
              </div>
            </div>
            <div className="form-control">
              <label className="label font-bold text-gray-700 text-xs uppercase">Your Experience</label>
              <textarea
                name="feedback"
                className="textarea textarea-bordered h-24 bg-gray-50 focus:ring-2 focus:ring-green-500 rounded-xl"
                placeholder="Share your thoughts..."
                required
              />
            </div>
            <div className="modal-action">
              <button
                type="button"
                onClick={() => document.getElementById("review-modal").close()}
                className="btn btn-sm btn-ghost"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-sm bg-[#00332c] text-white border-none px-6">
                Submit Review
              </button>
            </div>
          </form>
        </div>
      </dialog>

      {/* Details Modal */}
      <dialog id="details-modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-white rounded-2xl p-0 overflow-hidden shadow-2xl max-w-md">
          <div className="bg-[#00332c] p-6 text-white">
            <h3 className="font-bold text-lg">Policy Summary</h3>
            <p className="text-xs opacity-70 truncate">{detailsPolicy?.policyTitle}</p>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <p className="text-[10px] uppercase font-bold text-gray-400">Nominee</p>
                <p className="font-bold text-[#00332c] text-sm truncate">
                  {detailsPolicy?.nomineeName || "N/A"}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <p className="text-[10px] uppercase font-bold text-gray-400">Relation</p>
                <p className="font-bold text-[#00332c] text-sm">
                  {detailsPolicy?.nomineeRelation || detailsPolicy?.relation || "N/A"}
                </p>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <p className="text-[10px] uppercase font-bold text-blue-600">Assigned Agent</p>
              <p className="text-sm font-bold text-blue-900">
                {detailsPolicy?.agentName || "Waiting for admin..."}
              </p>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-dashed">
              <span className={`badge font-bold p-3 border-none ${
                detailsPolicy?.status === "Rejected" ? "bg-red-100 text-red-600" : "bg-orange-100 text-orange-600"
              }`}>
                {detailsPolicy?.status || "Processing"}
              </span>
              <button
                onClick={() => document.getElementById("details-modal").close()}
                className="btn btn-ghost btn-sm font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default MyPolicies;