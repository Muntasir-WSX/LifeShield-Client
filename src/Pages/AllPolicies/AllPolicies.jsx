import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../Hooks/UseAxiosPublic";
import Loading from "../../SharedComponents/Loading/Loading";
import AllPoliciesCard from "./AllPoiciesCard";
import { FaFilter, FaSearch } from "react-icons/fa";

const AllPolicies = () => {
  const axiosPublic = useAxiosPublic();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 9;

  const { data: policiesData, isLoading } = useQuery({
    queryKey: ["policies", search, category, currentPage],
    queryFn: async () => {
      const res = await axiosPublic.get(
        `/all-policies?search=${search}&category=${category}&page=${currentPage}&size=${itemsPerPage}`,
      );
      return res.data;
    },
  });

  const totalPages = Math.ceil((policiesData?.count || 0) / itemsPerPage);

  if (isLoading) return <Loading />;

  return (
    <div className="container mx-auto py-10">

      <div className="bg-white p-6 rounded-4xl shadow-sm border border-gray-100 mb-10 mx-4">
        <div className="flex flex-col md:flex-row items-center gap-6">
         
          <div className="relative w-full md:flex-1">
            <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by policy name (e.g. Shield, Senior...)"
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 transition-all outline-none text-[#00332c] font-medium"
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(0); 
              }}
            />
          </div>
          <div className="relative w-full md:w-1/3">
            <FaFilter className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
            <select
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 transition-all outline-none text-[#00332c] font-bold appearance-none cursor-pointer"
              onChange={(e) => {
                setCategory(e.target.value);
                setCurrentPage(0); 
              }}
            >
              <option value="All">All Categories</option>
              <option value="Term Life">Term Life</option>
              <option value="Senior Plan">Senior Plan</option>
              <option value="Whole Life">Whole Life</option>
              <option value="Health">Health</option>
            </select>
          </div>
        </div>

       
        <div className="mt-4 px-2">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
            Showing {policiesData?.result?.length || 0} of{" "}
            {policiesData?.count || 0} Policies
          </p>
        </div>
      </div>
      {/* Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        {policiesData?.result.map((policy) => (
          <AllPoliciesCard key={policy._id} policy={policy} />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-12 gap-2">
        {[...Array(totalPages).keys()].map((number) => (
          <button
            key={number}
            className={`btn ${currentPage === number ? "btn-success" : "btn-outline"}`}
            onClick={() => setCurrentPage(number)}
          >
            {number + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AllPolicies;
