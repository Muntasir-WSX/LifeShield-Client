import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { UserCheck, XCircle, Info } from 'lucide-react';

const ManageApplications = () => {
    const axiosSecure = useAxiosSecure();
    const { data: applications = [], refetch: refetchApps } = useQuery({
        queryKey: ['admin-applications'],
        queryFn: async () => {
            const res = await axiosSecure.get('/all-applications');
            return res.data;
        }
    });
    const { data: agents = [] } = useQuery({
        queryKey: ['all-agents'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users/agents');
            return res.data;
        }
    });
    const handleAssignAgent = (appId, agent) => {
        const [agentEmail, agentName] = agent.split('|');
        
        axiosSecure.patch(`/applications/assign/${appId}`, {
            agentEmail,
            agentName,
            status: "Assigned"
        })
        .then(res => {
            if (res.data.modifiedCount > 0) {
                refetchApps();
                Swal.fire("Assigned!", `Policy assigned to ${agentName}`, "success");
            }
        });
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-black text-[#00332c] mb-6">Manage Insurance Applications</h2>

            <div className="overflow-x-auto bg-white rounded-3xl shadow-sm border border-gray-100">
                <table className="table w-full">
                    <thead className="bg-gray-50 text-gray-600">
                        <tr>
                            <th>Applicant</th>
                            <th>Policy Name</th>
                            <th>Status</th>
                            <th>Assign Agent</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map((app) => (
                            <tr key={app._id} className="hover:bg-gray-50/50 transition-colors border-b">
                                <td>
                                    <div className="font-bold">{app.userName}</div>
                                    <div className="text-xs opacity-50">{app.userEmail}</div>
                                </td>
                                <td className="font-medium text-gray-700">{app.policyTitle}</td>
                                <td>
                                    <span className={`badge badge-sm font-bold p-3 ${
                                        app.status === 'Assigned' ? 'badge-info text-white' : 
                                        app.status === 'Approved' ? 'badge-success text-white' : 'badge-warning'
                                    }`}>
                                        {app.status || 'Pending'}
                                    </span>
                                </td>
                                <td>
                                    {app.status === 'Approved' ? (
                                        <span className="text-xs font-bold text-green-600 uppercase">Handled by {app.agentName}</span>
                                    ) : (
                                        <select 
                                            className="select select-bordered select-sm w-full max-w-xs rounded-lg"
                                            onChange={(e) => handleAssignAgent(app._id, e.target.value)}
                                            defaultValue=""
                                        >
                                            <option value="" disabled>Select Agent</option>
                                            {agents.map(agent => (
                                                <option key={agent._id} value={`${agent.email}|${agent.name}`}>
                                                    {agent.name}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </td>
                                <td className="flex gap-2">
                                    <button className="btn btn-square btn-sm btn-ghost text-blue-500">
                                        <Info size={18} />
                                    </button>
                                    <button className="btn btn-square btn-sm btn-ghost text-red-500">
                                        <XCircle size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageApplications;