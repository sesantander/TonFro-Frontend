import React from 'react'
import { Link } from 'react-router-dom';

const BackComponent = (props) => {
  return (
    <>
       <Link
             className="btn btn-default pull-right"
             to={props.back}
             data-toggle="tooltip"
             title="Add Point"
              > <i className="fa fa-angle-double-left"></i>Back
       </Link>
     </>
  )
}

export default BackComponent