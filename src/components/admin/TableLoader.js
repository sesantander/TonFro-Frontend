import React from 'react'

const TableLoader = (props) => {
  return (
    <tr><td colSpan={props.colspan} className="" style={{textAlign: 'center'}}>Loading <i className ="small-loader spinner" style={{position: 'relative',marginLeft: '5px',verticalAlign: 'sub'}}></i></td></tr>
  )
}

export default TableLoader