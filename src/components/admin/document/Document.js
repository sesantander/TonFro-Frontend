import React, { Component } from 'react';

// import point from '../../../services/point';
import documents from '../../../services/documents';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';

class Document extends Component {
  constructor(props){
    super(props);
     this.state = {
                open: true,
                list: [],
                total: 1,
                loading:true
            }
            this.heading = 'Document';

  }

  // componentWillMount(){}
   componentDidMount () {
   
        this.getList();
   }
   getList = () => {

            documents.list().then(res => {
                console.log(res)
                let data = res.data;
                this.setState({
                    list: data.data,
                    total: (data.total / 10),
                    loading:false
                });
            });
 
        }
  // componentWillUnmount(){}

  // componentWillReceiveProps(){}
  // shouldComponentUpdate(){}
  // componentWillUpdate(){}
  // componentDidUpdate(){}


  render() {
    return (
      <>
      <section className="content-header">
      <div className="bg-light lter b-b wrapper-md clearfix">
        <div className="pull-left">
          <h1>{this.heading}</h1>
        </div>
        <div className="pull-rigth">
          <Link className="btn btn-default pull-right" to="/document/add" data-toggle="tooltip" title="Add Document"><i className="fa fa-plus"></i> Add Document</Link>
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
                                     <th>Title</th>
                                     <th>Latitude</th>
                                     <th>Longitude</th>
                                     <th>Status</th>
                                     <th>Created</th>
                                     <th>Action</th>
                                  </tr>
                                
                             
                                  {
                                  this.state.list.map(val=>{
                                  return (
                                  <tr key={val.id}>
                                     <td>{val.name}</td>
                                     <td>{val.email}</td>
                                     <td> {val.role}
                                     </td>
                                     <td>{val.enterprise_id}</td>
                                     <td>
                                     <Link to={'/document/edit/'+val.id} className="btn btn-info btn-xs">Edit</Link>
                                     <button type="button" className="btn btn-warning btn-xs">Pass</button>
                                     </td>
                                  </tr>
                                  )
                                  })   
                                  }
                                  {
                                    this.state.loading?<tr><center>Loading <i className="fa fa-spinner fa-spin" style={{fontSize:'14px'}}></i></center></tr>:''
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
);
  }
}

export default Document;