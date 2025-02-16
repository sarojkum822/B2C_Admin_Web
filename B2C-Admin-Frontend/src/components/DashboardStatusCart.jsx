import axios from 'axios';
import React, { useEffect, useState } from 'react';
import StatsCard from './StatsCard';

const DashboardStatusCard = () => {
    const [status, setStatus] = useState(null); // Default to null to prevent unnecessary renders
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getStatus = async () => {
            try {
                const res = await axios.get("https://b2c-backend-1.onrender.com/api/v1/admin/dashboard/inforamtion");
                setStatus(res.data.data); // Assuming response structure is { data: { totalEarnings, totalOrders, ... } }
            } catch (error) {
                console.error("Error fetching dashboard information:", error);
            } finally {
                setLoading(false);
            }
        };

        getStatus();
    }, []); // Runs only once when the component mounts
    console.log(status);
    
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <StatsCard title="Revenue" value={`Rs ${status?.totalEarning.toLocaleString()}`} percentage="+22%" color="green" />
            <StatsCard title="Orders" value={status?.totalOrders.toLocaleString()} percentage="-25%" color="red" />
            <StatsCard title="Inventory" value={status?.totalOutlets.toLocaleString()} percentage="+49%" color="green" />
            <StatsCard title="Customers" value={status?.totalCustomers.toLocaleString()} percentage="+1.0%" color="yellow" />
            <StatsCard title="Outlets" value={status?.totalOutletPartners.toLocaleString()} percentage="+3.5%" color="blue" />
        </div>
    );
};

export default DashboardStatusCard;
