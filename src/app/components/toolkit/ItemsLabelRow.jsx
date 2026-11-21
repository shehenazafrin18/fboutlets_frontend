import React from 'react'

export function ItemsLabelRow({ lable, filed }) {
    return (
        <div className='card_items_row_flex'>
            <div className='label_box'> {lable}</div>
            <div className='item_data d-flex'><strong>: </strong> <div className='pl-1'> {filed}</div> </div>
        </div>
    )
}

