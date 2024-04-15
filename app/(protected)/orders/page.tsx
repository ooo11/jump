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

export default function Page() {
    const user = useCurrentUser();
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState<UserData | null>(null);

    useEffect(() => {
        async function fetchProducts() {
            setIsLoading(true);
            if (user?.id) {
                try {
                    const ordersData = await getAllOrderByUserId(user.id);
                    if (ordersData) {
                        const filteredOrders = ordersData?.orders.filter(order => order.isSubmitted !== null);
                        setUserData({ ...ordersData, orders: filteredOrders });
                    }
                } catch (error) {
                    console.error("Failed to fetch products:", error);
                    setUserData(null);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setIsLoading(false);
            }
        }

        fetchProducts();
    }, [user?.id]);

    // Function to handle status change
    const handleStatusChange = async (orderId: string, newStatus: "ACCEPTED" | "REJECTED") => {

        setIsLoading(true);
        try {
            const response = await orderAcceptanceUpdate(orderId, { isAccepted: newStatus });
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


    return (

        <div className="flex items-center justify-center py-10">
            {isLoading ? (
                <p className='flex justify-center items-center h-screen'>Loading...</p>
            ) : (
                userData && userData.orders.length > 0 && (
                    <div className="overflow-x-auto relative">
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
                            <tbody>
                                {userData.orders.map((order, index) => (
                                    <tr key={index} className="hover:bg-gray-100">
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            {order.name}
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            {order.email}
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            {order.location}
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            {order.date}
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            {order.time}
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <select
                                                value={order.isAccepted}
                                                onChange={(e: any) => handleStatusChange(order.id, e.target.value)}
                                                disabled={order.isAccepted === "ACCEPTED" || order.isAccepted === "REJECTED"}
                                                className="text-gray-900 rounded cursor-pointer ease-linear transition-all duration-150"
                                            >
                                                {order.isAccepted === "PENDING" && <option value="PENDING">Pending</option>}
                                                <option value="ACCEPTED">Accepted</option>
                                                <option value="REJECTED">Rejected</option>
                                            </select>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            Payment Status
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>


                ))
            }
        </div>
    )
}

