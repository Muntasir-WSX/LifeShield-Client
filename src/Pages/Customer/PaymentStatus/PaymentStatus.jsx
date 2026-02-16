import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, CheckCircle, Clock, Download } from "lucide-react";
import useAxiosSecure from "../../../Hooks/UseAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import { useReactToPrint } from "react-to-print";
import Invoice from "./Invoice";

const PaymentStatus = () => {
  const [policies, setPolicies] = useState([]);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const invoiceRef = useRef(null);

  useEffect(() => {
    if (user?.email) {
      axiosSecure
        .get(`/my-approved-policies/${user.email}`)
        .then((res) => setPolicies(res.data))
        .catch((err) => console.error(err));
    }
  }, [user?.email, axiosSecure]);

  const handlePrint = useReactToPrint({
    contentRef: invoiceRef,
  });

  const handleDownloadClick = (policy) => {
    setSelectedPolicy(policy);
    setTimeout(() => {
      handlePrint();
    }, 100);
  };

  return (
    <div className="p-6">
      <div style={{ display: "none" }}>
        {selectedPolicy && <Invoice ref={invoiceRef} data={selectedPolicy} />}
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-[#00332c]">Payment Management</h3>
        <p className="text-sm text-gray-500">
          Track and pay your policy premiums
        </p>
      </div>

      <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-100">
        <table className="table w-full">
          <thead className="bg-gray-50">
            <tr className="text-[#00332c] border-b">
              <th className="p-4 text-left">Policy Name</th>
              <th className="p-4 text-left">Premium</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {policies.map((policy) => (
              <tr
                key={policy._id}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="p-4">
                  <div className="font-bold">{policy.policyTitle}</div>
                  <div className="text-[10px] opacity-50 uppercase font-mono">
                    ID: {policy._id}
                  </div>
                </td>
                <td className="p-4 font-semibold text-[#00332c]">
                  ৳{(policy.amount || 0).toLocaleString("en-BD")}
                </td>
                <td className="p-4">
                  {policy.paymentStatus === "Paid" ? (
                    <span className="flex items-center gap-1 text-green-600 font-bold text-xs uppercase bg-green-50 px-2 py-1 rounded-md w-fit">
                      <CheckCircle size={14} /> Paid
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-orange-500 font-bold text-xs uppercase bg-orange-50 px-2 py-1 rounded-md w-fit">
                      <Clock size={14} /> Payment Due
                    </span>
                  )}
                </td>
                <td className="p-4 text-center">
                  {policy.paymentStatus === "Paid" ? (
                    <div className="flex flex-col items-center gap-2">
                      <button
                        onClick={() => handleDownloadClick(policy)}
                        className="btn btn-xs bg-[#00332c] text-white hover:bg-black rounded-lg px-3 flex items-center gap-1 border-none"
                      >
                        <Download size={12} /> Receipt
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() =>
                        navigate(`/dashboard/payment/${policy._id}`, {
                          state: { amount: policy.amount },
                        })
                      }
                      className="btn btn-sm bg-[#00332c] hover:bg-[#002521] text-white border-none rounded-xl px-4"
                    >
                      <CreditCard size={14} className="mr-2" /> Pay Now
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {policies.length === 0 && (
          <div className="text-center py-20 text-gray-400 font-medium">
            No policy data found.
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentStatus;
