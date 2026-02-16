import React from 'react';

const Invoice = React.forwardRef(({ data }, ref) => {
    return (
        <div ref={ref} className="p-16 bg-white text-black font-sans">
            {/* Header */}
            <div className="flex justify-between items-start border-b-2 border-[#00332c] pb-8">
                <div>
                    <h1 className="text-3xl font-black text-[#00332c] uppercase tracking-tighter">Life Shield</h1>
                    <p className="text-sm font-medium text-gray-600">Premium Insurance Receipt</p>
                </div>
                <div className="text-right">
                    <h2 className="text-xl font-bold">INVOICE</h2>
                    <p className="text-sm text-gray-500">Date: {new Date().toLocaleDateString('en-GB')}</p>
                </div>
            </div>

            {/* Info Section */}
            <div className="my-10 grid grid-cols-2 gap-4">
                <div>
                    <p className="text-xs uppercase font-bold text-gray-400 mb-1">Billed To</p>
                    <p className="font-bold text-lg">{data.applicantName}</p>
                    <p className="text-sm text-gray-600">{data.applicantEmail}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs uppercase font-bold text-gray-400 mb-1">Transaction ID</p>
                    <p className="text-sm font-mono bg-gray-100 p-1 rounded inline-block">{data.transactionId || 'N/A'}</p>
                </div>
            </div>

            {/* Table */}
            <div className="mt-10">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-[#00332c] text-white">
                            <th className="p-3">Policy Description</th>
                            <th className="p-3 text-right">Amount Paid</th>
                        </tr>
                    </thead>
                    <tbody className="border-b">
                        <tr>
                            <td className="p-4 italic font-medium">{data.policyTitle}</td>
                            <td className="p-4 text-right font-bold text-lg">৳{(data.paidAmount || data.amount).toLocaleString('en-BD')}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="mt-20 text-center border-t pt-10">
                <div className="inline-block px-4 py-1 bg-green-100 text-green-700 font-bold rounded-full text-xs uppercase mb-4">
                    Status: Verified & Paid
                </div>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                    This is an electronically generated document. No signature required.
                </p>
                <p className="text-[10px] font-bold text-[#00332c] mt-2">Life Shield Insurance Ltd.</p>
            </div>
        </div>
    );
});

export default Invoice;