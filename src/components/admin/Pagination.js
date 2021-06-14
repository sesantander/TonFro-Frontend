import React from 'react'
import ReactPaginate from 'react-paginate';

const Pagination = (props) => {
   
  return (
                 <div className="box-footer clearfix">
                           <ReactPaginate 
                                pageCount={props.total}
                                pageRangeDisplayed={1}
                                marginPagesDisplayed={2}
                                previousLabel="«"
                                activeClassName="active"
                                onPageChange={props.onChange}
                                containerClassName="pagination pagination-sm no-margin pull-right"
                                ></ReactPaginate >
                         </div>
  )
}

export default Pagination