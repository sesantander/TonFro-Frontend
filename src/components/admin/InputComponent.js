import React from 'react'

const InputComponent = (props) => {
  // console.log(props)
  const finalDivClass = (props.propValues.isRequired)?(props.propValues.required? "form-group has-error": "form-group required"):'form-group';
  const finalInputClass = (props.propValues.isRequired)?(props.propValues.required? "form-control error": "form-control required"):'form-control';
  return (
            

                                    <div  className={finalDivClass}>
                                      <label className="control-label">{props.propValues.label}</label>
                                      <input
                                        type={(props.propValues.type)?props.propValues.type:'text'}
                                        name={props.propValues.name}
                                        value={(props.propValues.value)?props.propValues.value:''}
                                        id={props.propValues.name}
                                        autoComplete="off"
                                        placeholder={props.propValues.label}
                                        className={finalInputClass}
                                        onChange={(e) => props.propValues.onChange(e)}
                                      />
                                      {
                                        props.propValues.required?<span className="span-error">Required</span>:null
                                    }
                                    </div>
            
    
  )
}

export default InputComponent