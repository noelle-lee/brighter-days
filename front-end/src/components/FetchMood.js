import React from 'react';
import { MdDeleteForever, MdEdit } from 'react-icons/md';

function FetchMood({ currentMood, onDelete, onEdit }) {
    return (
        <tr>
        <td>{currentMood.mood}</td>
        <td>{currentMood.date}</td>
        <td><MdEdit className="Edit-icon" onClick={ () => onEdit(currentMood) }/></td>
        <td><MdDeleteForever className="Edit-icon" onClick={ () => onDelete(currentMood._id) }/></td>
    </tr>
    )
}

export default FetchMood;