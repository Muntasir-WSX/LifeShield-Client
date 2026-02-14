import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import useAxiosPublic from "../../Hooks/UseAxiosPublic";
import Swal from "sweetalert2";

const QuoteApplicationFrom = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();
  const location = useLocation();

  const { premium, coverage, policyTitle, policyId } = location.state || {};

  const handleApplication = async (e) => {
    e.preventDefault();
    const form = e.target;

    const applicationData = {
      applicantName: user?.displayName,
      applicantEmail: user?.email,
      address: form.address.value,
      nid: form.nid.value,
      nomineeName: form.nomineeName.value,
      relation: form.relation.value,
      healthDisclosure: form.health.value,
      policyTitle: policyTitle,
      policyId: policyId,
      coverageAmount: coverage,
      amount: premium,
      status: "Pending",
      paymentStatus: "Unpaid",
      appliedDate: new Date().toISOString(),
    };

    try {
      const res = await axiosPublic.post("/applications", applicationData);
      if (res.data.insertedId) {
        Swal.fire({
          title: "Application Received!",
          text: "Successfully submitted. Please proceed to payment.",
          icon: "success",
          confirmButtonColor: "#00332c",
        }).then(() => {
          navigate(`/dashboard/payment/${res.data.insertedId}`, {
            state: {
              appId: res.data.insertedId,
              payableAmount: premium,
            },
          });
        });
      }
    } catch (error) {
      Swal.fire("Error", "Something went wrong.", "error");
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-10 p-6 md:p-12 bg-white shadow-2xl rounded-[3rem] border border-gray-50">
      {/* Header */}
      <div className="text-center mb-14">
        <div className="inline-block px-5 py-2 mb-4 text-[10px] font-bold tracking-[0.2em] text-green-700 uppercase bg-green-50 rounded-full border border-green-100">
          Enrollment Form
        </div>
        <h2 className="text-5xl font-black text-[#00332c] tracking-tight mb-4">
          LIFE INSURANCE APPLICATION
        </h2>
        <div className="flex items-center justify-center gap-3">
          <span className="text-gray-400 font-medium">Selected Plan:</span>
          <span className="px-4 py-1.5 text-sm font-bold text-white bg-green-600 rounded-lg shadow-sm">
            {policyTitle || "Critical Illness Protector"}
          </span>
        </div>
      </div>

      <form onSubmit={handleApplication} className="space-y-12">
        {/* Section 1: Personal Info */}
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <span className="flex items-center justify-center w-10 h-10 text-base font-bold text-white bg-[#00332c] rounded-xl shadow-lg">
              1
            </span>
            <h3 className="text-xl font-bold text-gray-800 tracking-tight italic">
              Personal Information
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="form-control w-full">
              <label className="label-text mb-2.5 ml-1 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                Full Name
              </label>
              <input
                type="text"
                defaultValue={user?.displayName}
                readOnly
                className="input input-bordered w-full h-14 bg-gray-50/50 font-bold text-gray-500 border-gray-200 rounded-2xl focus:outline-none"
              />
            </div>
            <div className="form-control w-full">
              <label className="label-text mb-2.5 ml-1 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                Email Address
              </label>
              <input
                type="email"
                defaultValue={user?.email}
                readOnly
                className="input input-bordered w-full h-14 bg-gray-50/50 font-bold text-gray-500 border-gray-200 rounded-2xl focus:outline-none"
              />
            </div>
            <div className="form-control w-full">
              <label className="label-text mb-2.5 ml-1 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                Permanent Address
              </label>
              <input
                type="text"
                name="address"
                placeholder="House, Road, City"
                className="input input-bordered w-full h-14 border-gray-200 rounded-2xl focus:border-green-500 focus:ring-4 focus:ring-green-50 transition-all shadow-sm placeholder:text-gray-300"
                required
              />
            </div>
            <div className="form-control w-full">
              <label className="label-text mb-2.5 ml-1 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                National ID Number (NID)
              </label>
              <input
                type="text"
                name="nid"
                placeholder="Enter NID"
                className="input input-bordered w-full h-14 border-gray-200 rounded-2xl focus:border-green-500 focus:ring-4 focus:ring-green-50 transition-all shadow-sm placeholder:text-gray-300"
                required
              />
            </div>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent"></div>

        {/* Section 2: Nominee */}
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <span className="flex items-center justify-center w-10 h-10 text-base font-bold text-white bg-[#00332c] rounded-xl shadow-lg">
              2
            </span>
            <h3 className="text-xl font-bold text-gray-800 tracking-tight italic">
              Nominee Details
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="form-control w-full">
              <label className="label-text mb-2.5 ml-1 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                Nominee Full Name
              </label>
              <input
                type="text"
                name="nomineeName"
                placeholder="Beneficiary name"
                className="input input-bordered w-full h-14 border-gray-200 rounded-2xl focus:border-green-500 focus:ring-4 focus:ring-green-50 transition-all shadow-sm placeholder:text-gray-300"
                required
              />
            </div>
            <div className="form-control w-full">
              <label className="label-text mb-2.5 ml-1 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                Relation with Applicant
              </label>
              <select
                name="relation"
                className="select select-bordered w-full h-14 border-gray-200 rounded-2xl focus:border-green-500 focus:ring-4 focus:ring-green-50 font-medium text-gray-600"
                required
              >
                <option value="" disabled selected>
                  Select Relation
                </option>
                <option value="Spouse">Spouse</option>
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Child">Child</option>
                <option value="Sibling">Sibling</option>
              </select>
            </div>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent"></div>

        {/* Section 3: Health */}
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <span className="flex items-center justify-center w-10 h-10 text-base font-bold text-white bg-[#00332c] rounded-xl shadow-lg">
              3
            </span>
            <h3 className="text-xl font-bold text-gray-800 tracking-tight italic">
              Health Disclosure
            </h3>
          </div>
          <div className="form-control w-full">
            <label className="label-text mb-2.5 ml-1 text-[11px] font-black text-gray-400 uppercase tracking-widest">
              Medical History & Conditions
            </label>
            <textarea
              name="health"
              className="textarea textarea-bordered w-full h-40 border-gray-200 rounded-3xl focus:border-green-500 focus:ring-4 focus:ring-green-50 transition-all shadow-sm p-5 text-gray-600 leading-relaxed resize-none placeholder:text-gray-300"
              placeholder="Please describe any major surgeries, chronic illnesses, or hereditary conditions in detail..."
            ></textarea>
          </div>
        </div>

        {/* Submit Section */}
        <div className="p-10 mt-16 bg-[#fafafa] rounded-[3rem] border border-gray-100 shadow-inner">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left space-y-1">
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
                Monthly Premium Investment
              </p>
              <h4 className="text-5xl font-black text-[#00332c] flex items-baseline gap-1">
                ৳{premium?.toLocaleString() || "2,450"}
                <span className="text-sm font-bold text-gray-400 tracking-normal italic">
                  /month
                </span>
              </h4>
            </div>
            <button
              type="submit"
              className="w-full md:w-auto px-16 py-6 text-lg font-black text-white bg-[#00332c] rounded-[2rem] hover:bg-black hover:-translate-y-1 transition-all duration-300 shadow-[0_20px_50px_rgba(0,51,44,0.2)] active:scale-95 uppercase tracking-widest"
            >
              Confirm & Pay Now
            </button>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-200/50 text-[10px] text-gray-400 text-center md:text-left leading-loose max-w-2xl">
            <span className="text-green-600 font-bold mr-1">
              ● Secure Enrollment:
            </span>
            By clicking confirm, you legally acknowledge that all information
            provided is accurate. False disclosure will lead to immediate claim
            denial according to{" "}
            <span className="underline cursor-pointer">Policy Section 4.2</span>
            .
          </div>
        </div>
      </form>
    </div>
  );
};

export default QuoteApplicationFrom;
