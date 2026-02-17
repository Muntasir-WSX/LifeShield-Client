import React, { useState, useEffect } from "react";
import { Send, CheckCircle, Clock, FileText, UploadCloud } from "lucide-react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/UseAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import Loading from "../../../SharedComponents/Loading/Loading";

const uploadToImgBB = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
};

const ClaimRequest = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [policies, setPolicies] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.email) {
      axiosSecure
        .get(
          `/my-approved-policies/${user.email}?page=${currentPage}&size=${itemsPerPage}`,
        )
        .then((res) => {
          setPolicies(res.data.result || []);
          setTotalCount(res.data.count || 0);
        })
        .catch((err) => {
          console.error(err);
          setPolicies([]);
        });
    }
  }, [user?.email, axiosSecure, currentPage]);
  const numberOfPages = Math.ceil(totalCount / itemsPerPage);
  const pages = [...Array(numberOfPages).keys()];

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target;
    const reason = form.reason.value;
    const pdfFile = form.document.files[0];

    if (pdfFile && pdfFile.type !== "application/pdf") {
      Swal.fire("Error", "Please upload a valid PDF file (Invoice)", "error");
      setLoading(false);
      return;
    }

    try {
      const claimData = {
        claimStatus: "Pending",
        claimReason: reason,
        claimDocument:
          "https://your-storage.com/files/invoice_" + Date.now() + ".pdf",
        submittedAt: new Date().toISOString(),
      };

      const res = await axiosSecure.patch(
        `/applications/claim/${selectedPolicy._id}`,
        claimData,
      );
      if (res.data.modifiedCount > 0) {
        Swal.fire("Success", "Claim invoice submitted successfully", "success");
        setPolicies((prev) =>
          prev.map((p) =>
            p._id === selectedPolicy._id ? { ...p, ...claimData } : p,
          ),
        );
        setSelectedPolicy(null);
      }
    } catch (error) {
      Swal.fire("Error", "Submission failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header section remains same */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-[#00332c]">Claim & Invoices</h3>
        <p className="text-sm text-gray-500">
          Submit your medical invoices (PDF) for policy settlement
        </p>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-100">
        <table className="table w-full">
          <thead>
            <tr className="bg-gray-50 text-[#00332c]">
              <th className="py-4">Policy Name</th>
              <th>Claim Status</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {policies.map((policy) => (
              <tr
                key={policy._id}
                className="hover:bg-gray-50 border-b transition-colors"
              >
                <td className="font-bold text-gray-700 py-4">
                  {policy.policyTitle || policy.policyName || "Policy Unit"}
                </td>
                <td>
                  {policy.claimStatus ? (
                    <div className="flex flex-col gap-1">
                      <span
                        className={`badge ${policy.claimStatus === "Pending" ? "badge-warning" : "badge-success text-white"} gap-1 py-3 text-xs font-bold`}
                      >
                        {policy.claimStatus === "Pending" ? (
                          <Clock size={12} />
                        ) : (
                          <CheckCircle size={12} />
                        )}
                        {policy.claimStatus}
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-400 italic text-sm">
                      No Invoice Filed
                    </span>
                  )}
                </td>
                <td className="text-center">
                  {!policy.claimStatus ? (
                    <button
                      onClick={() => setSelectedPolicy(policy)}
                      className="btn btn-sm bg-[#00332c] text-white hover:bg-black border-none px-5 rounded-lg"
                    >
                      Submit Claim
                    </button>
                  ) : (
                    <button
                      disabled
                      className="btn btn-sm btn-disabled rounded-lg"
                    >
                      Processed
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalCount > itemsPerPage && (
        <div className="flex justify-center gap-2 mt-4">
          {pages.map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`btn btn-xs ${currentPage === page ? "bg-[#00332c] text-white" : ""}`}
            >
              {page + 1}
            </button>
          ))}
        </div>
      )}

      {/* Modal for PDF Upload */}
      {selectedPolicy && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-xl font-bold text-[#00332c]">
                Claim Settlement Form
              </h4>
              <button
                onClick={() => setSelectedPolicy(null)}
                className="text-gray-400 hover:text-red-500 text-3xl font-light"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleClaimSubmit} className="space-y-4">
              <div>
                <label className="label text-xs font-bold uppercase text-gray-500">
                  Policy Name
                </label>
                <input
                  type="text"
                  readOnly
                  value={
                    selectedPolicy.policyTitle || selectedPolicy.policyName
                  }
                  className="input input-bordered w-full bg-gray-50 font-semibold"
                />
              </div>

              <div>
                <label className="label text-xs font-bold uppercase text-gray-500">
                  Reason for Claim
                </label>
                <textarea
                  name="reason"
                  required
                  className="textarea textarea-bordered w-full h-20 focus:ring-2 focus:ring-green-500"
                  placeholder="Describe why you are claiming..."
                ></textarea>
              </div>

              {/* PDF Upload Field */}
              <div>
                <label className="label text-xs font-bold uppercase text-gray-500">
                  Upload Invoice (PDF only)
                </label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-green-500 transition-colors bg-gray-50">
                  <input
                    type="file"
                    name="document"
                    accept="application/pdf"
                    required
                    className="hidden"
                    id="pdf-upload"
                  />
                  <label
                    htmlFor="pdf-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <UploadCloud className="text-gray-400" size={32} />
                    <span className="text-sm text-gray-600 font-medium">
                      Click to upload or drag & drop
                    </span>
                    <span className="text-xs text-gray-400">
                      Supported format: .pdf (Max 5MB)
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setSelectedPolicy(null)}
                  className="btn flex-1 bg-gray-100 hover:bg-gray-200 border-none text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn flex-1 bg-green-600 hover:bg-green-700 text-white border-none"
                >
                  {loading ? (
                    <Loading></Loading>
                  ) : (
                    "Submit Invoice"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClaimRequest;
