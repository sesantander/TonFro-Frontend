import React from 'react'
import Select from 'react-select';

const PointComponent = (props) => {
  console.log(props)
  return (
       <div className="row">
                                  <div className="col-md-4">
                                    <div className="form-group required">
                                      <label className="control-label">Title</label>
                                      <Select
                                        value={props.value}
                                        classNamePrefix="fwidth"
                                        onChange={(e)=>props.SourceChange(e,props.index)}
                                        options={props.options}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-4">
                                   <div className="form-group required">
                                        <label className="control-label">Distance From Previous point</label>
                                        <input
                                              type="text"
                                              name="distanceFromPrev"
                                              value={props.distanceFromPrev}
                                              id="dispoint"
                                              className="form-control"
                                              autoComplete="off"
                                              placeholder="Distance From Previous point"
                                                
                                              onChange={(e) => props.RoutePointInput(e,props.index)}
                                            />
                                      </div>
                                     
                                  </div>
                                  <div className="col-md-3">
                                   {/*<div className="form-group required">
                                        <label className="control-label">Time From Previous point</label>
                                            <input
                                              type="text"
                                              name="timeFromPrev"
                                              value={props.timeFromPrev}
                                              id="timepoint"
                                              className="form-control"
                                              autoComplete="off"
                                              placeholder="Time From Previous point"
                                              className="form-control"
                                              onChange={(e) => props.RoutePointInput(e,props.index)}
                                            />
                                          </div>*/}
                                  </div>
                                  <div className="col-md-1">
                                      <button type="button" className="btn btn-danger btn-flat" style={{marginTop: '28px'}} onClick={()=>props.remove(props.index)}><i className="fa fa-close"></i></button>
                                     
                                  </div>
                                </div>
                                  
  )
}

export default PointComponent