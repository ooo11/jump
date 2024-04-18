"use client"
import { orderAcceptanceUpdate } from "@/actions/order-acceptance-update";
import { getAllOrderByUserId, getAllProductByUserId } from "@/data/fetch-data";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useEffect, useState } from "react";

interface Product {
    id: string;
    name: string;
    image: string | null;
    price: string;
    detail: string;
    userId: string;
}

interface Order {
    id: string;
    name: string;
    email: string;
    emailVerified: Date | null;
    isPaid: Date | null;
    isSubmitted: Date | null;
    isAccepted: "ACCEPTED" | "REJECTED" | "PENDING";
    location: string;
    phone: string;
    productId: string;
    date: string;
    time: string;
    submission: Date;
    cityId: string;
}

interface UserData {
    products: Product[];
    orders: Order[];
}

type ExpandedRows = {
    [key: string]: boolean;
};

const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-UK", {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

export default function Page() {
    const user = useCurrentUser();
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [sortAscending, setSortAscending] = useState(true);
    const [filter, setFilter] = useState("");


    useEffect(() => {
        const fetchOrders = async () => {
            setIsLoading(true);
            if (user?.id) {
                try {
                    const data = await getAllOrderByUserId(user.id);
                    if (data) {
                        const sortedOrders = data.orders.sort((a, b) => {
                            const dateA = new Date(a.date).getTime();
                            const dateB = new Date(b.date).getTime();
                            return sortAscending ? dateA - dateB : dateB - dateA;
                        });
                        setUserData({ ...data, orders: sortedOrders });
                    }
                } catch (error) {
                    console.error("Failed to fetch orders:", error);
                    setUserData(null);
                }
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [user?.id, sortAscending]);

    const toggleDateSort = () => {
        setSortAscending(!sortAscending);
    };

    const filteredOrders = () => {
        // Return all orders if filter is "", otherwise filter by the selected status
        return userData ? userData.orders.filter(order =>
            filter === "" ? true : order.isAccepted === filter
        ) : [];
    };

    // Function to handle status change
    const handleStatusChange = async (orderId: string, newStatus: "ACCEPTED" | "REJECTED", email: string) => {

        setIsLoading(true);
        try {
            const response = await orderAcceptanceUpdate(orderId, { isAccepted: newStatus }, email);
            if (response.success) {
                setUserData(prev => {
                    if (prev === null) {
                        // Handle the case where there is no previous data (could also return null or initial state)
                        return null;
                    }
                    return {
                        ...prev,
                        orders: prev.orders.map(order =>
                            order.id === orderId ? { ...order, isAccepted: newStatus } : order
                        )
                    };
                });
            } else {
                console.error("Failed to update order status:", response.error);
            }
        } catch (error) {
            console.error("Error updating order status:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Existing states and hooks
    const [expandedRows, setExpandedRows] = useState<ExpandedRows>({});

    // Existing functions and effects

    const toggleRowExpansion = (orderId: string) => {
        setExpandedRows(prev => ({
            ...prev,
            [orderId]: !prev[orderId] // Toggle the expansion state of the row
        }));
    };


    return (

        <div className="flex items-center justify-center py-10">
            <div className="overflow-x-auto relative">
                <div className="flex justify-between items-center p-4 bg-white shadow-md">
                    <button
                        onClick={toggleDateSort}
                        className="px-4 py-2 text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-button-theme focus:ring-opacity-50 rounded-md"
                    >
                        {sortAscending ? "Sort Date ↓" : "Sort Date ↑"}
                    </button>
                    <select
                        onChange={(e) => setFilter(e.target.value)}
                        value={filter}
                        className="form-select px-4 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-button-theme focus:outline-none focus:ring-2 focus:ring-button-theme focus:ring-opacity-50"
                    >
                        <option value="">All</option>
                        <option value="ACCEPTED">Accepted</option>
                        <option value="REJECTED">Rejected</option>
                        <option value="PENDING">Pending</option>
                    </select>
                </div>
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Location
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Time
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Payment Status
                            </th>
                        </tr>
                    </thead>
                    {isLoading ? (
                        <tbody> <tr>
                            <td colSpan={7} className="px-8 py-8 bg-white text-sm">
                                <div className="flex items-center justify-center">Loading ...</div>
                            </td>
                        </tr></tbody>
                    ) : (
                        (userData && filteredOrders().length > 0) ? (
                            <tbody>
                                {filteredOrders().map((order, index) => (
                                    <>
                                        <tr key={order.id} onClick={() => toggleRowExpansion(order.id)} className="hover:bg-gray-50 active:bg-gray-100 cursor-pointer">
                                            <td className="px-5 py-5 border-b border-gray-200  text-sm">
                                                {order.name}
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                                {order.email}
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                                {order.location}
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                                {formatDate(order.date)}
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                                {order.time}
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                                <select
                                                    value={order.isAccepted}
                                                    onChange={(e: any) => handleStatusChange(order.id, e.target.value, order.email)}
                                                    disabled={order.isAccepted === "ACCEPTED" || order.isAccepted === "REJECTED"}
                                                    className="text-gray-900 rounded cursor-pointer ease-linear transition-all duration-150"
                                                >
                                                    {order.isAccepted === "PENDING" && <option value="PENDING">Pending</option>}
                                                    <option value="ACCEPTED">Accepted</option>
                                                    <option value="REJECTED">Rejected</option>
                                                </select>
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                                {order.isAccepted === "ACCEPTED" ? (order.isPaid ? (<p>Paid</p>) : (<p>Pending payment</p>)) : null}
                                            </td>
                                        </tr>
                                        {expandedRows[order.id] && (
                                            <tr>
                                                <td colSpan={7} className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <div><strong>Phone:</strong> {order.phone}</div>
                                                    <div><strong>Order ID:</strong> {order.id}</div>
                                                    <div><strong>City:</strong> {order.cityId}</div>
                                                    {/* Add more details as needed */}
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                ))}
                            </tbody>


                        ) : (
                            filteredOrders().length === 0 && (<tbody> <tr>
                                <td colSpan={7} className="px-8 py-8 bg-white text-sm">

                                </td>
                            </tr></tbody>)
                        )
                    )
                    }
                </table>
            </div>
        </div>
    )
}

