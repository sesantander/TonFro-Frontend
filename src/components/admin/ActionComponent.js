import React from 'react'

const ActionComponent = (props) => {
  return (
    <div className="box-footer" style={{ textAlign: "left" }}>
       <button type="submit" className={'btn btn-sm btn-primary mrg-rt'+ ((props.loading)?' loading':'') } disabled={props.loading}>
          {
          (props.loading)?  <div className="loader button-loader spinner" style={{paddingLeft: '2.5rem'}} >
           </div>:''
         }
              Save
           </button>
             
     </div>
  )
}

export default ActionComponent