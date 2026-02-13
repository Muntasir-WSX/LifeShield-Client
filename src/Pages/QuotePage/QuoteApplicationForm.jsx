import React from 'react';
import useAuth from '../../Hooks/useAuth';
import useAxiosPublic from '../../Hooks/UseAxiosPublic';
import Swal from 'sweetalert2';

const QuoteApplicationFrom = () => {
    const { user } = useAuth();
    const axiosPublic = useAxiosPublic();

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
            status: "Pending", 
            appliedDate: new Date().toISOString()
        };

        const res = await axiosPublic.post('/applications', applicationData);
        if(res.data.insertedId) {
            Swal.fire("Success!", "Application submitted for review.", "success");
            form.reset();
        }
    };

    return (
        <div className="max-w-3xl mx-auto my-10 p-8 bg-gray-50 rounded-3xl">
            <h2 className="text-2xl font-black mb-8 text-center uppercase tracking-widest">Life Insurance Application</h2>
            <form onSubmit={handleApplication} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" defaultValue={user?.displayName} readOnly className="input input-bordered bg-gray-100" />
                    <input type="email" defaultValue={user?.email} readOnly className="input input-bordered bg-gray-100" />
                </div>
                <input type="text" name="address" placeholder="Full Address" className="input input-bordered w-full" required />
                <input type="text" name="nid" placeholder="NID Number" className="input input-bordered w-full" required />
                
                <div className="divider">Nominee Details</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" name="nomineeName" placeholder="Nominee Name" className="input input-bordered" required />
                    <input type="text" name="relation" placeholder="Relationship" className="input input-bordered" required />
                </div>

                <div className="divider">Health Disclosure</div>
                <textarea name="health" className="textarea textarea-bordered w-full" placeholder="Any pre-existing medical conditions?"></textarea>

                <button className="btn btn-block bg-[#00332c] text-white hover:bg-black">Submit Application</button>
            </form>
        </div>
    );
};

export default QuoteApplicationFrom;