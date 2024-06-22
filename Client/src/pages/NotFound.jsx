import React from 'react'
import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div>
       <div className='d-flex justify-content-center align-items-center flex-column'> 
        <img src="https://media1.giphy.com/media/yeMg2ckHHvrOw/giphy.gif" alt="" />
        <div className='text-center'>
            <h1 className='fw-bold display-4'>404</h1>
            <h1 className='fw-bold display-4 text-capitalize'>page not found</h1>
            <Link to={'/'}>
                <button className='btn btn-success text-capitalize mt-3'>
                    go to home
                </button>
            </Link>
        </div>
    </div>
    </div>
  )
}

export default NotFound