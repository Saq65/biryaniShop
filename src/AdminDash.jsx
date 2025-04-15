import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const AdminDashboard = () => {
    const [orders, setOrders] = useState([]);
    const audioRef = useRef(new Audio('/preview.mp3'));

    useEffect(() => {
        const socket = io('http://localhost:5000'); 

        socket.on('newOrder', (order) => {
            setOrders((prev) => [order, ...prev]);

            audioRef.current.play();

            if (Notification.permission === 'granted') {
                new Notification('New Order Received', {
                    body: `Token #${order.token} - ₹${order.totalAmount}`,
                });
            }
        });

        if (Notification.permission !== 'granted') {
            Notification.requestPermission();
        }

        return () => {
            socket.disconnect();
        };
    }, []);

    console.log(orders,'orders')
    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
            {orders.length === 0 ? (
                <p>No orders yet...</p>
            ) : (
                <ul>
                    {orders.map((order, idx) => (
                        <li key={idx} className="border p-2 my-2 rounded">
                            <strong>Token #{order.token}</strong> — ₹{order.totalAmount}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AdminDashboard;
