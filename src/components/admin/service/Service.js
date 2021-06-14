import React,{Component} from 'react';
import ReactPaginate from 'react-paginate';

import user from '../../../services/user';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
class Service extends Component{
            constructor(props) {
            super(props)
            this.state = {
                open: true,
                list: [],
                total: 1,
            }
            this.heading = 'Services';
        }
        componentDidMount() {
           // this.getList();
            toast.success('🦄 Wow so easy!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
                });
        }
        getList = () => {
            user.list().then(res => {
                console.log(res)
                let data = res.data;
                this.setState({
                    list: data.data,
                    total: (data.total / 10)
                })
            })
        }
  render(){
    return (
      <>
      <section className="content-header">
      <ToastContainer />
      <div className="bg-light lter b-b wrapper-md clearfix">
        <div className="pull-left">
          <h1>{this.heading}</h1>
        </div>
        <div className="pull-rigth">
          <Link className="btn btn-default pull-right" to="/service/add" data-toggle="tooltip" title="Add Service"><i className="fa fa-plus"></i> Add Service</Link>
        </div>
      </div>
    </section>
       <section className="content">
             
                      <div className="box">
                         <div className="box-header with-border">
                            <h3 className="box-title">{this.heading}</h3>
                         </div>
                         <div className="box-body">
                            <table className="table table-striped">
                                 <tbody>
                                  <tr>
                                     <th>ID</th>
                                     <th>Title</th>
                                     
                                     <th>Status</th>
                                     <th>Action</th>
                                  </tr>
                                
                             
                                  {
                                  this.state.list.map(val=>{
                                  return (
                                  <tr key={val.id}>
                                     <td>{val.name}</td>
                                     
                                     <td> {val.role}
                                     </td>
                                     <td>{val.enterprise_id}</td>
                                     <td>
                                     <Link to={'/user/edit/'+val.id} className="btn btn-info btn-xs">Edit</Link>
                                     <button type="button" className="btn btn-warning btn-xs">Pass</button>
                                     </td>
                                  </tr>
                                  )
                                  })   
                                  }
                               </tbody>
                            </table>
                         </div>
                         <div className="box-footer clearfix">
                       <ReactPaginate 
                            pageCount={this.state.total}
                            pageRangeDisplayed={1}
                            marginPagesDisplayed={2}
                            previousLabel="«"
                            activeClassName="active"
                            onPageChange={this.handlePageClick}
                            containerClassName="pagination pagination-sm no-margin pull-right"
                            ></ReactPaginate >
                      </div>
                      </div>
                      
                    
      </section>
      </>
)
  }
}
export default Service