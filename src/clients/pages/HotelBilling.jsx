import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronUp, ChevronDown } from 'lucide-react';
import QRCode from 'react-qr-code';
import axios from 'axios';
import io from 'socket.io-client';
import AdminDashboard from '../../AdminDash';
import Swal from "sweetalert2";
const socket = io('https://localhost:5000');

const menuItems = [
    { name: 'Ghost (1 kg)', price: 120 },
    { name: 'Ghost Plate', price: 35 },
    { name: 'Biryani Plate', price: 30 },
    { name: '1 Kg Biryani', price: 140 },
    { name: 'Keema Plate', price: 40 },
    { name: 'Bheja Plate', price: 45 },
    { name: 'Roti', price: 1 },
];

const MeatHotelBilling = () => {
    const [quantities, setQuantities] = useState(Array(menuItems.length).fill(0));
    const [token, setToken] = useState(() => parseInt(localStorage.getItem('meatToken') || '1000'));
    const [upiUrl, setUpiUrl] = useState('');
    const [showQR, setShowQR] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const receiptRef = useRef();
    const navigate = useNavigate();

    const handleQuantityChange = (index, value) => {
        const updated = [...quantities];
        updated[index] = Math.max(0, parseInt(value) || 0);
        setQuantities(updated);
    };

    const increment = (index) => handleQuantityChange(index, quantities[index] + 1);
    const decrement = (index) => handleQuantityChange(index, quantities[index] - 1);

    const calculateTotal = () =>
        quantities.reduce((total, qty, idx) => total + qty * menuItems[idx].price, 0);

    const handleGenerate = async () => {
        const totalAmount = calculateTotal();
        if (totalAmount === 0) return Swal.fire({
            icon:'warning',
            title: "Please select at least one item.",
            
        })

        const nextToken = token + 1;
        localStorage.setItem('meatToken', nextToken);
        setToken(nextToken);

        const upi = `upi://pay?pa=saklainshaikh974@okicici&pn=Meat%20Hotel&am=${totalAmount}&cu=INR`;
        setUpiUrl(upi);
        setShowQR(true);

        try {
            const orderResponse = await axios.post('http://localhost:5000/api/orders', {
                items: menuItems.map((item, index) => ({
                    name: item.name,
                    qty: quantities[index],
                    price: item.price,
                })),
                totalAmount,
                token: nextToken,
            });

            socket.emit('orderCompleted', orderResponse.data._id);
        } catch (err) {
            setErrorMessage('Error creating order, please try again.');
            console.error('Error creating order:', err);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    useEffect(() => {
        socket.on('orderCompleted', (data) => {
            alert(`Order ID: ${data.orderId} is completed`);
            const audio = new Audio('./preview.mp3');
            audio.play();
        });

        return () => socket.off('orderCompleted');
    }, []);

    return (
        <>
            <div className="flex justify-start w-full p-4 bg-gradient-to-r from-red-600 to-yellow-500 text-white">
                <button
                    className="bg-white text-red-600 font-bold py-2 px-4 rounded shadow hover:bg-gray-100"
                    onClick={() => navigate(-1)}
                >
                    Back
                </button>
            </div>

            <div className="max-w-6xl mx-auto bg-gray-50 shadow-xl p-4 sm:p-6 md:p-8 rounded-lg mt-4">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-red-700 mb-6">🍖 Meat Hotel Billing</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {menuItems.map((item, index) => (
                        <div
                            key={item.name}
                            className="flex justify-between items-center bg-white border-l-4 border-red-500 p-3 rounded shadow"
                        >
                            <div className="text-sm sm:text-base md:text-lg font-medium text-gray-800">
                                {item.name} <span className="text-sm text-gray-500">(₹{item.price})</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <button onClick={() => decrement(index)} className="bg-gray-200 p-1 rounded">
                                    <ChevronDown size={16} />
                                </button>
                                <input
                                    type="number"
                                    min="0"
                                    value={quantities[index]}
                                    onChange={(e) => handleQuantityChange(index, e.target.value)}
                                    className="w-14 border text-center rounded px-2 py-1 text-sm"
                                />
                                <button onClick={() => increment(index)} className="bg-gray-200 p-1 rounded">
                                    <ChevronUp size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 text-lg sm:text-xl font-bold text-right text-green-700">
                    Total: ₹{calculateTotal()}
                </div>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
                    <button
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow w-full sm:w-auto"
                        onClick={handleGenerate}
                    >
                        Generate Token & QR
                    </button>
                    {showQR && (
                        <button
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded shadow w-full sm:w-auto"
                            onClick={handlePrint}
                        >
                            Print Receipt
                        </button>
                    )}
                </div>

                {showQR && (
                    <div
                        ref={receiptRef}
                        className="mt-10 bg-white border-l-4 border-yellow-400 shadow p-6 rounded text-center"
                    >
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                            🧾 Order Token #: <span className="text-red-600">{token}</span>
                        </h3>
                        <p className="mb-2 text-sm text-gray-600">Scan to pay via UPI</p>
                        <div className="flex justify-center">
                            <QRCode value={upiUrl} size={180} />
                        </div>
                        <p className="mt-4 text-lg font-semibold text-green-700">
                            Total: ₹{calculateTotal()}
                        </p>
                    </div>
                )}

                {errorMessage && <div className="text-red-500 mt-4">{errorMessage}</div>}
            </div>

            <AdminDashboard />
        </>
    );
};

export default MeatHotelBilling;
