import React,{Component} from 'react'
// import user from '../../../services/user';
// import ReactPaginate from 'react-paginate';
// import { Link } from 'react-router-dom';
// import point from '../../../services/point';
import ActionComponent from '../ActionComponent';
import BackComponent from '../BackComponent';

class NewDocument extends Component{
     constructor(props){
    	super(props)
    	this.state =  {
                'form': {
                    "name": 'Test',
                    "type": '1234',
                    "status": '',
                    'image':null,

                    
                },
                'required': {
                      "name": false,
                      "type": false,
                      "status": false,
                       
                },
                'loading':false

            };
        this.requiredText =  ["name","type","status"];

      
    }
    componentDidMount(){
       let params = this.props.match.params;
       if(typeof params.id!=='undefined'){
        this.getUser(params.id);
      }
  }
    handleUserInput (e) {
    const name = e.target.name;
    const value = e.target.value;
    const form  = this.state['form'];
    form[name] = value;
    console.log(this.state.form)
    this.setState({'form':form});
   
 
}
  // getUser = (id) =>{
  //       user.getUser(id).then(res=>{
  //           console.log(res)
  //           let data = res.data;
            
  //       })
  // }
 
  fileChangedHandler = event => {
     let state = this.state.form;
     state['profile_image'] = event.target.files[0];
     this.setState({ 'form': state });
     console.log(this.state)
  }
  handleSubmit = (event) =>{
    event.preventDefault();
    let req = this.state.required;
    this.requiredText.forEach((v)=>{
        if(this.state['form'][v]===''){
          console.log(v)
           req[v]=true;
           this.setState({
             'required':req
           });
            console.log(this.state)
        }
        
    });
    if(this.state.form['name']!=='' && this.state.form['lat']!=='' && this.state.form['long']!==''){
        // point.add(this.state.form).then(res=>{
        //   console.log(res)
        // })
    }
    const data = new FormData();
    console.log(data)
   
  }
	render(){
		return (
            <>
            <section className="content-header">
              <div className="bg-light lter b-b wrapper-md clearfix">
                <div className="pull-left">
                  <h1>Add Document</h1>
                </div>
                <div className="pull-rigth">
                  <BackComponent back="/document"></BackComponent>
                </div>
              </div>
            </section>
            <section className="content">
              <form onSubmit={this.handleSubmit}>
                <div className="box">
                  <div className="box-header with-border">
                    <h3 className="box-title">Point</h3>
                  </div> 
                  <div className="box-body">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group required">
                          <label className="control-label">Name</label>
                          <input
                            type="text"
                            name="name"
                            value={this.state["form"].name}
                            id="name"
                            autoComplete="off"
                            placeholder="Name"
                            className={
                              this.state["required"].name
                                ? "form-control error"
                                : "form-control"
                            }
                            onChange={(e) => this.handleUserInput(e)}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="control-label">Type</label>
                          <input
                            type="text"
                            name="lat"
                            value={this.state["form"].type}
                            id="lat"
                            
                            autoComplete="off"
                            placeholder="Lat"
                             className={
                              this.state["required"].type
                                ? "form-control error"
                                : "form-control"
                            }
                            onChange={(e) => this.handleUserInput(e)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                     
                      <div className="col-md-6">
                        <div className="form-group required">
                          <label className="control-label">Status</label>
                          <select name="status" value={this.state["form"].status} className={
                              this.state["required"]["status"]
                                ? "form-control error"
                                : "form-control"
                            }
                            onChange={(e) => this.handleUserInput(e)}>
                            <option value="" >
                              -- Select Status --
                            </option>
                            <option value="1">Active</option>
                            <option value="0">Deactive</option>
                          </select>
                        </div>
                      </div>
                    </div>
                   
                  </div>
                  <ActionComponent loading={this.state.loading}></ActionComponent>
                </div>
              </form>
            </section>
          </>

           )
	}
}
export default NewDocument