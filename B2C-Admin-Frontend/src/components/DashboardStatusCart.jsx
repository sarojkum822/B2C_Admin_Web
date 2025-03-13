import axios from 'axios';
import React, { useEffect, useState } from 'react';
import StatsCard from './StatsCard';

const DashboardStatusCard = () => {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        const fetchDashboardData = async () => {
            // Try to load cached data immediately
            const cachedData = localStorage.getItem('dashboardData');
            
            if (cachedData) {
                // Show cached data immediately to reduce perceived latency
                setStatus(JSON.parse(cachedData));
                setLoading(false);
                setIsRefreshing(true); // Indicate we're refreshing in the background
            }
            
            try {
                // Check if we need to fetch fresh data
                const cachedTimestamp = localStorage.getItem('dashboardDataTimestamp');
                const currentTime = new Date().getTime();
                const cacheExpiry = 3600000; // 1 hour cache
                
                // Always fetch if no timestamp or cache is expired
                const shouldFetch = !cachedTimestamp || (currentTime - parseInt(cachedTimestamp) >= cacheExpiry);
                
                if (shouldFetch || isRefreshing) {
                    // Fetch fresh data
                    const res = await axios.get("https://b2c-backend13.onrender.com/api/v1/admin/dashboard/inforamtion");
                    const dashboardData = res.data.data;
                    
                    // Store in localStorage
                    localStorage.setItem('dashboardData', JSON.stringify(dashboardData));
                    localStorage.setItem('dashboardDataTimestamp', currentTime.toString());
                    
                    // Update state with fresh data
                    setStatus(dashboardData);
                }
            } catch (error) {
                console.error("Error fetching dashboard information:", error);
                // No need to handle fallback to cache here as we already loaded cached data
            } finally {
                setLoading(false);
                setIsRefreshing(false);
            }
        };

        fetchDashboardData();
    }, []);
    
    if (loading && !status) {
        return (
            <div className="bg-gray-50">
                <div className="p-2">Loading...</div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <StatsCard 
                title="Revenue" 
                value={`Rs ${status?.totalEarning.toLocaleString()}`} 
                percentage="+22%" 
                color="green"
                loading={isRefreshing}
            />
            <StatsCard 
                title="Orders" 
                value={status?.totalOrders.toLocaleString()} 
                percentage="-25%" 
                color="red"
                loading={isRefreshing}
            />
            <StatsCard 
                title="Inventory" 
                value={status?.totalOutlets.toLocaleString()} 
                percentage="+49%" 
                color="green"
                loading={isRefreshing}
            />
            <StatsCard 
                title="Customers" 
                value={status?.totalCustomers.toLocaleString()} 
                percentage="+1.0%" 
                color="yellow"
                loading={isRefreshing}
            />
            <StatsCard 
                title="Outlets" 
                value={status?.totalOutletPartners.toLocaleString()} 
                percentage="+3.5%" 
                color="blue"
                loading={isRefreshing}
            />
        </div>
    );
};

export default DashboardStatusCard;