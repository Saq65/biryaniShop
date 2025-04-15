import React from 'react';
import { useNavigate } from 'react-router-dom';


function Home() {
    const navigate = useNavigate();
    return (
        <div className='flex justify-center align-center w-100'>
            <div className='flex justify-between gap-5'>
                <div className='bg-blue-500 px-3 py-3 rounded text-white hover:bg-blue-400 cursor-pointer' onClick={() => navigate('/biryani')}>
                    Biryani Billing
                </div>
                <div className='bg-green-400 px-3 py-3 rounded text-white hover:bg-green-300 cursor-pointer' onClick={() => navigate('/hotel')}>
                    Hotel Billing
                </div>
            </div>
        </div>
    )
}

export default Home;