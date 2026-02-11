import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosPublic from '../../Hooks/UseAxiosPublic';
import PolicyCard from './PopularCard';


const PopularPolicies = () => {
    const axiosPublic = useAxiosPublic();

    const { data: policies = [], isLoading } = useQuery({
        queryKey: ['popularPolicies'],
        queryFn: async () => {
            const res = await axiosPublic.get('/popular-policies');
            return res.data;
        }
    });

    if (isLoading) return <div className="text-center py-20 text-2xl font-bold">Loading Policies...</div>;

    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-extrabold text-[#00332c] mb-4">Our Popular Policies</h2>
                    <p className="text-gray-500 max-w-xl mx-auto">
                        Explore the most trusted and widely purchased insurance plans chosen by thousands of our happy families.
                    </p>
                </div>

                {/* Grid Layout for 6 Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {policies.map(policy => (
                        <PolicyCard key={policy._id} policy={policy} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PopularPolicies;