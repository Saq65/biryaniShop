import React, { useState } from 'react'

function Todo() {
    const [todoData, setTodoData] = useState();
    const [showData, setShowData] = useState([]);
    function handlDelete(updatedindex) {
        const updated = showData.map((_, index) => index !== updatedindex);
        setShowData(updated)
    }
    return (
        <div className='bg-green-200' style={{ minHeight: '200px' }}>
            <h2>Todo List</h2>
            <div>
                <input type="search" onChange={(e) => setTodoData(e.target.value)} className='form-control border' placeholder='add todo' name="" id="" />
                <button className='bg-[#000] text-white' onClick={() => setShowData([...showData, todoData])}>add</button>
            </div>
            <div className='bg-blue-400'>
                <ul>
                    {
                        showData.map((res, index) => (
                            <>
                                <li className='flex justify-around'>{res} </li>
                                <span onClick={() => handlDelete(index)}>X</span>
                            </>
                        ))
                    }
                </ul>
            </div>
        </div>
    )
}

export default Todo