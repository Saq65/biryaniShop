import React, { useState, useRef } from 'react';
import QRCode from 'react-qr-code';
import { useNavigate } from 'react-router-dom';

const BillingPage = () => {
  const [biryaniQty, setBiryaniQty] = useState(1);
  const [salad, setSalad] = useState(false);
  const [onion, setOnion] = useState(false);
  const [raita, setRaita] = useState(false);
  const [token, setToken] = useState(() => {
    return parseInt(localStorage.getItem('token') || '1000');
  });
  const [showQR, setShowQR] = useState(false);
  const [upiUrl, setUpiUrl] = useState('');
  const receiptRef = useRef(null);

  const biryaniPrice = 150;
  const saladPrice = 10;
  const onionPrice = 5;
  const raitaPrice = 20;

  const calculateTotal = () => {
    let total = biryaniQty * biryaniPrice;
    if (salad) total += saladPrice;
    if (onion) total += onionPrice;
    if (raita) total += raitaPrice;
    return total;
  };

  const handleGenerate = () => {
    const nextToken = token + 1;
    localStorage.setItem('token', nextToken);
    setToken(nextToken);

    const totalAmount = calculateTotal();
    const upiLink = `upi://pay?pa=saklainshaikh974@okicici&pn=Biryani%20Shop&am=${totalAmount}&cu=INR`;
    setUpiUrl(upiLink);
    setShowQR(true);
  };

  const handlePrint = () => {
    const printContent = receiptRef.current.innerHTML;
    const win = window.open('', '', 'width=600,height=600');
    win.document.write(`
      <html>
        <head>
          <title>Receipt</title>
          <style>
            body { font-family: sans-serif; padding: 20px; }
            h2 { text-align: center; }
            p, li { font-size: 16px; margin: 4px 0; }
            .qr { display: flex; justify-content: center; margin-top: 20px; }
          </style>
        </head>
        <body>${printContent}</body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  const navigate = useNavigate();

  return (
    <>
      <div className="flex justify-start p-4">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-md"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-white shadow-lg rounded-xl space-y-6">

        <h2 className="text-3xl font-bold text-center text-blue-600">Biryani Billing</h2>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <label className="text-lg font-medium text-gray-700">Biryani Plates:</label>
          <input
            type="number"
            min="1"
            value={biryaniQty}
            onChange={(e) => setBiryaniQty(parseInt(e.target.value))}
            className="border p-2 rounded-md w-full sm:w-24 text-center"
          />
        </div>

        <div className="max-w-6xl space-y-3">
          <label className="flex items-center text-gray-700">
            <input type="checkbox" checked={salad} onChange={() => setSalad(!salad)} className="mr-2" />
            Salad (+₹{saladPrice})
          </label>
          <label className="flex items-center text-gray-700">
            <input type="checkbox" checked={onion} onChange={() => setOnion(!onion)} className="mr-2" />
            Onion (+₹{onionPrice})
          </label>
          <label className="flex items-center text-gray-700">
            <input type="checkbox" checked={raita} onChange={() => setRaita(!raita)} className="mr-2" />
            Raita (+₹{raitaPrice})
          </label>
        </div>

        <p className="text-xl font-semibold text-gray-800">Total: ₹{calculateTotal()}</p>

        <button
          onClick={handleGenerate}
          className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
        >
          Generate Token
        </button>

        {showQR && (
          <div className="mt-6 text-center space-y-4" ref={receiptRef}>
            <h3 className="text-xl font-semibold text-gray-800">Token #: {token}</h3>
            <ul className="inline-block text-left text-gray-700 space-y-1">
              <li>Biryani: {biryaniQty} x ₹{biryaniPrice}</li>
              {salad && <li>+ Salad</li>}
              {onion && <li>+ Onion</li>}
              {raita && <li>+ Raita</li>}
            </ul>
            <p className="text-lg font-bold text-gray-900">Total Amount: ₹{calculateTotal()}</p>
            <div className="flex justify-center">
              <QRCode value={upiUrl} size={160} />
            </div>
          </div>
        )}

        {showQR && (
          <button
            onClick={handlePrint}
            className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            Print Receipt
          </button>
        )}
      </div>
    </>
  );
};

export default BillingPage;
