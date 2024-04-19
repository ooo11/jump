"use client"
import { orderAcceptanceUpdate } from "@/actions/order-acceptance-update";
import { formatCurrency } from "@/app/lib/utils";
import { fetchCityById, fetchProductById, getAllOrderByUserId, getAllProductByUserId } from "@/data/fetch-data";
import { useCurrentUser } from "@/hooks/use-current-user";
import { City } from "@prisma/client";
import React from "react";
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
    cityName: string | undefined;
    price: string | undefined;
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
    const [cityNames, setCityNames] = useState<{ [key: string]: string }>({});


    useEffect(() => {
        const fetchOrders = async () => {
            setIsLoading(true);
            if (user?.id) {
                try {
                    const data = await getAllOrderByUserId(user.id);
                    if (data) {
                        // Fetch city names for each order and add to the orders array
                        const ordersWithCities = await Promise.all(data.orders.map(async (order) => {
                            try {
                                const city = await fetchCityById(order.cityId);
                                const product = await fetchProductById(order.productId);

                                return { ...order, cityName: city ? city.name : 'Unknown', price: product?.price };
                            } catch (error) {
                                console.error(`Failed to fetch city for order ${order.id}:`, error);
                                return { ...order, cityName: 'Unknown', price: 'Unknown' }; // default if city fetch fails
                            }
                        }));

                        // Sort orders with cities now included
                        const sortedOrders = ordersWithCities.sort((a, b) => {
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

    console.log(userData);


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

    const rowClassName = (orderId: string) => {
        return expandedRows[orderId] ? "bg-gray-50 cursor-pointer border-b border-gray-50 hover:bg-gray-200" : "hover:bg-gray-200 border-b border-gray-200 cursor-pointer";
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
                                Contact
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                City
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Date & Time
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Price
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
                                    <React.Fragment key={order.id} >
                                        <tr onClick={() => toggleRowExpansion(order.id)} className={rowClassName(order.id)}>
                                            <td className="px-5 py-5 text-sm">
                                                {order.name}
                                            </td>
                                            <td className="px-5 py-5 text-sm">
                                                {order.phone}<br />
                                                {order.email}

                                            </td>
                                            <td className="px-5 py-5 text-sm">
                                                {order.cityName}
                                            </td>
                                            <td className="px-5 py-5 text-sm">
                                                Date: {formatDate(order.date)} <br />
                                                Time: {order.time}
                                            </td>
                                            <td className="px-5 py-5 text-sm">
                                                {order.isPaid ?
                                                    (<p className="font-bold text-green-500">{formatCurrency(Number(order.price) / 100)}</p>) :
                                                    (<p className="font-regular text-gray-500">{formatCurrency(Number(order.price) / 100)}</p>)}
                                            </td>
                                            <td className="px-5 py-5 text-sm">
                                                <select
                                                    value={order.isAccepted}
                                                    onChange={(e: any) => handleStatusChange(order.id, e.target.value, order.email)}
                                                    disabled={order.isAccepted === "ACCEPTED" || order.isAccepted === "REJECTED"}
                                                    className="text-gray-900 rounded cursor-pointer ease-linear transition-all duration-150"
                                                >
                                                    {order.isAccepted === "PENDING" && <option value="PENDING">Pending</option>}
                                                    <option value="ACCEPTED">Accept</option>
                                                    <option value="REJECTED">Reject</option>
                                                </select>
                                            </td>
                                            <td className="px-5 py-5 text-sm">
                                                {order.isAccepted === "ACCEPTED" ? (order.isPaid ? (<p>Paid</p>) : (<p>Pending payment</p>)) : null}
                                            </td>
                                        </tr>
                                        {expandedRows[order.id] && (
                                            <tr>
                                                <td colSpan={7} className="px-5 py-5 border-b border-gray-200 bg-gray-50 text-sm">
                                                    <div><strong>Phone:</strong> {order.phone}</div>
                                                    <div><strong>Order ID:</strong> {order.id}</div>
                                                    <div><strong>Address:</strong>  {order.location}</div>
                                                    {/* Add more details as needed */}
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
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

