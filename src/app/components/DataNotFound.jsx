import React from 'react'
import { toAbsoluteUrl } from '../../_metronic/_helpers'

export default function DataNotFound() {
    return (
        <>
            <div className='data_not_found_box'> 
                <img
                    src={toAbsoluteUrl("/media/error/data_not_found.gif")} 
                    alt='' 
                /> 
            </div>
        
        </> 
    )
}

