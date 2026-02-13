import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosPublic from '../../Hooks/UseAxiosPublic';
import Loading from '../../SharedComponents/Loading/Loading';
import AllPoliciesCard from './AllPoiciesCard';


const AllPolicies = () => {
    const axiosPublic = useAxiosPublic();
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 9;

    const { data: policiesData, isLoading } = useQuery({
        queryKey: ['policies', search, category, currentPage],
        queryFn: async () => {
            const res = await axiosPublic.get(`/all-policies?search=${search}&category=${category}&page=${currentPage}&size=${itemsPerPage}`);
            return res.data;
        }
    });

    const totalPages = Math.ceil((policiesData?.count || 0) / itemsPerPage);

    if (isLoading) return <Loading />;

    return (
        <div className="container mx-auto py-10">
            {/* Search and Filter Section */}
            <div className="flex flex-col md:flex-row gap-4 mb-10 px-4">
                <input 
                    type="text" 
                    placeholder="Search by policy name..." 
                    className="input input-bordered w-full md:w-1/2"
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select 
                    className="select select-bordered w-full md:w-1/4"
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="All">All Categories</option>
                    <option value="Term Life">Term Life</option>
                    <option value="Senior Plan">Senior Plan</option>
                    <option value="Health">Health</option>
                </select>
            </div>

            {/* Grid Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
                {policiesData?.result.map(policy => (
                    <AllPoliciesCard key={policy._id} policy={policy} />
                ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-12 gap-2">
                {[...Array(totalPages).keys()].map(number => (
                    <button
                        key={number}
                        className={`btn ${currentPage === number ? 'btn-success' : 'btn-outline'}`}
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