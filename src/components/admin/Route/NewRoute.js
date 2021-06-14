import React,{Component} from 'react'
import route from '../../../services/route';
import point from '../../../services/point';
import { Link } from 'react-router-dom';
// import Select from 'react-select';
import notification from '../../../services/notification';
import { ToastContainer } from 'react-toastify';

import { Tabs, Tab, TabPanel, TabList } from 'react-web-tabs';
import 'react-web-tabs/dist/react-web-tabs.css';
import ActionComponent from '../ActionComponent';
import InputComponent from '../InputComponent';
import PointComponent from '../PointComponent';
class NewRoute extends Component{
     constructor(props){
    	super(props)
    	this.state =  {
                'form': {
                    "name": '',
                    //"source": '',
                    //"destination": '',
                    "isActive": '',
                    'attr1':'',
                    'attr2':''
                },
                'required': {
                      "title": false,
                      "status": false,
                },
                'source':{},
                'destination':{},
                'points':[],
                'route_points':[{
                    'pointId':'',
                    'distanceFromPrev':0,
                    // 'timeFromPrev':0,
                    }],
                'rpoint':[{value: '', label: ''}],
                loading:false,
                ploading:false,
                'routeId':'',
                

            };

        this.requiredText =  ["name","isActive"];
        this.options = [
                { value: 'chocolate', label: 'Chocolate' },
                { value: 'strawberry', label: 'Strawberry' },
                { value: 'vanilla', label: 'Vanilla' },
              ];

      
    } 
    addMorePoint = () =>{
      const route_points = this.state.route_points;
      const rpoint = this.state.rpoint;
       
      route_points.push({
                    'pointId':'',
                    'distanceFromPrev':0,
                    // 'timeFromPrev':0,
                    });
      rpoint.push({value: '', label: ''});
      this.setState({
        route_points:route_points,
        rpoint:rpoint,
      })
    } 

 handlePointSourceChange = (selectedOption,index) => {
  console.log(selectedOption)

   const route_points = this.state.route_points;
   const rpoint = this.state.rpoint;
   route_points[index].pointId = selectedOption.value;
   rpoint[index] = selectedOption;

   this.setState({'route_points': route_points, rpoint:rpoint,});
  }
 handleRoutePointInput = (e,index) => {
   const name = e.target.name;
   const value = e.target.value;
   const route_points = this.state.route_points;
   route_points[index][name] = value;

   this.setState({'route_points': route_points});
  }
    clearForm = () =>{
       console.log(this.form)
       this.setState({
                    'form': {
                    "name": '',
                    "source": '',
                    "destination": '',
                    "email": '',
                    "phone": '',
                    "password": '',
                    "status": '',
                    "rpassword": '',
                    "profile_image": null ,
                }
                });
       console.log(this.state.form)
    }
    componentDidMount(){
       let params = this.props.match.params;
       console.log(params)
       this.getPoints();
       if(typeof params.id!=='undefined'){

        this.setState({
          'routeId':params.id
        })
      // this.getPoints();

        // this.getRoutePoints({'routeId':params.id});
        this.getRoutePoints(params.id);
        this.get(params.id);
      }
  }
  getRoutePoints(params){
      route.getRoutePoint(params).then(res => {
                console.log(res)
                const data = res.data;
                if(data.data){
                  const point = data.data;
                  const route_points = [];
                  const rpoint = [];
                  point.forEach(row=>{
                    route_points.push({
                      pointId:row.pointId,
                      distanceFromPrev:row.distanceFromPrev
                    });
                    if(row.point){
                    rpoint.push({
                      value:row.pointId,
                      label:row.point.name
                    });
                  }else{
                    rpoint.push({
                      value:'',
                      label:''
                    });
                  }
                  });
                  this.setState({
                    route_points:route_points,
                    rpoint:rpoint
                  })
                }
                 
            });
                
  }
    get = (id) =>{
        route.get(id).then(res=>{
            console.log(res);
            let form = this.state.form;
            let data = res.data.data;
            console.log(data);
            if(data){
            form['name'] = data.name;
            form['isActive'] = (data.isActive)?1:0;
             
           
            this.setState({
          'routeId':data.id
              })
            this.setState({
            form
            });
          }

            
        })
  }
  getPoints(){
      point.list().then(res => {
                console.log(res)
                let data = res.data;
                let list = data.data;
                list.forEach(function(row){
                  row['value'] = row.id;
                  row['label'] = row.name;
                })
                this.setState({
                    'points': list,
                    
                });
            });
  }
 handleUserInput (e) {
    let updatedValue = notification.handleInput(e,this.state['form'],this.state['required'])
    //console.log(updatedValue)
    this.setState({'form':updatedValue.form,'required':updatedValue.required});
  }
 handleSourceChange = selectedOption => {
  console.log(selectedOption)
  const form = this.state['form'];
  form['source'] = selectedOption.value;
  this.setState({'source':selectedOption});
  this.setState({'form':form});
  };

 handleDestinationChange = selectedOption => {
  console.log(selectedOption)
  const form = this.state['form'];
  form['destination'] = selectedOption.value;
  this.setState({'destination':selectedOption});
  this.setState({'form':form});
  };
removeRow = (index) =>{
      console.log(index)
      const route_points = this.state.route_points;
      route_points.splice(index, 1);
      this.setState({'route_points': route_points});
}
 
 
  fileChangedHandler = event => {
     let state = this.state.form;
     state['profile_image'] = event.target.files[0];
     this.setState({ 'form': state });
     console.log(this.state)
  }

  handlePointSubmit = (event) =>{
    event.preventDefault();
    console.log(this.state.route_points);
    this.setState(
    {
      'ploading':true
    });
    console.log(this.state.routeId)
    if(this.state.routeId!==''){
     route.addRoutePoint({"points":this.state.route_points,"routeId":this.state.routeId}).then(res => {
                console.log(res);
                let red = res.data;
               
                this.setState({
                    'ploading': false
                });
                if(red.status)
                 {
                const data = red.data;
                (data.msg)?notification.success(data.msg):notification.success('Record Added');
                
                }
            }, error => {
                this.setState({
                    'loading': false,
                    'ploading': false
                });
                notification.error('Api error')
            })
    }else{
      notification.error('Please add or choose a route');
    }
  }
  handleSubmit = (event) =>{
    event.preventDefault();
    let req = this.state.required;

    let validate = true;
    this.requiredText.forEach((v)=>{
        if(this.state['form'][v]===''){
           req[v]=true;
           validate = false;
           this.setState({
             'required':req
           });
        }
    });
    console.log(this.state.routeId)
     if (validate) {
            const form = this.state.form;
             console.log(this.state)
            this.setState({
                'loading': true
            });
            if(this.state.routeId!==''){
              form['routeId'] = this.state.routeId;
              this.update(form)
            }else{
              this.add();
            }
        }
}

  add = () =>{
         route.add(this.state.form).then(res => {
                console.log(res);
                const data = res.data.data;
                this.setState({
                    'loading': false,
                    'routeId':data.id
                });
                notification.success('Record Added');
                this.clearForm();
            }, error => {
                this.setState({
                    'loading': false
                });
                notification.error('Api error')
            })
    }
  update = (form) =>{
         route.update(form).then(res => {
                console.log(res);
                this.setState({
                    'loading': false
                });
                notification.success('Record Updated');
                 
            }, error => {
                this.setState({
                    'loading': false
                });
                notification.error('Api error')
            })
    }

	render(){
		return (
            <>
            <section className="content-header">
            <ToastContainer />
              <div className="bg-light lter b-b wrapper-md clearfix">
                <div className="pull-left">
                  <h1>Add Route</h1>
                </div>
                <div className="pull-rigth">
                  <Link
                    className="btn btn-default pull-right"
                    to="/route"
                    data-toggle="tooltip"
                    title="Add Route"
                  >
                    <i className="fa fa-long-arrow-left"></i>Back
                  </Link>
                </div>
              </div>
            </section>
            <section className="content">
            <Tabs defaultTab="one"
                          onChange={(tabId) => { console.log(tabId) }}
                        >
                          <TabList>
                            <Tab tabFor="one" className="tab_view">Description</Tab>
                            <Tab tabFor="two" className="tab_view">Point</Tab>
                            
                          
                          </TabList>
                          <TabPanel tabId="one">
                            <form onSubmit={this.handleSubmit}>
                             <div className="box">
                              <div className="box-header with-border">
                                <h3 className="box-title">Route</h3>
                              </div> 
                              <div className="box-body">
                                <div className="row">
                                  <div className="col-md-6">
                                    <InputComponent 
                                        propValues={{
                                          label:'Title',
                                          required:this.state["required"].name,
                                          value:this.state["form"].name,
                                          onChange:this.handleUserInput.bind(this),
                                          name:'name',
                                          isRequired:true

                                        }}  />
                                 
                                  </div>
                                  <div className="col-md-6">
                                   <div className={
                                          this.state["required"]["isActive"]
                                            ? "form-group has-error"
                                            : "form-group"
                                        } >
                                      <label className="control-label">Status</label>
                                        <select name="isActive" value={this.state["form"].isActive} className={
                                          this.state["required"]["isActive"]
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
                                  {/* <div className="form-group">
                                      <label className="control-label">Source Point</label>
                                       
                                      <Select
                                        value={this.state['source']}
                                         className={
                                          this.state["required"]["source"]
                                            ? "error"
                                            : ""
                                        }
                                        classNamePrefix="fwidth"
                                        onChange={this.handleSourceChange}
                                        options={this.state.points}
                                      />
                                    </div> */}
                                  </div> 
                                </div>
                                {/*<div className="row">
                                  <div className="col-md-6">
                                    <div className="form-group required">
                                      <label className="control-label">Destination Point</label>
                                      
                                      <Select
                                        value={this.state["destination"]}
                                        className={
                                          this.state["required"]["destination"]
                                            ? "form-width error"
                                            : "form-width"
                                        }
                                        classNamePrefix="fwidth"
                                        onChange={(e) => this.handleDestinationChange(e)}
                                        options={this.state.points}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className={
                                          this.state["required"]["status"]
                                            ? "form-group has-error"
                                            : "form-group"
                                        } >
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
                                </div>*/}
                                <div className="row">
                                  <div className="col-md-6">
                                    <InputComponent 
                                  propValues={{
                                    label:'Attribute 1',
                                    
                                    value:this.state["form"].attr1,
                                    onChange:this.handleUserInput.bind(this),
                                    name:'attr1',
                                    isRequired:false

                                  }}  />
                                  </div>
                                  <div className="col-md-6">
                                    <InputComponent 
                                  propValues={{
                                    label:'Attribute 2',
                                     
                                    value:this.state["form"].attr2,
                                    onChange:this.handleUserInput.bind(this),
                                    name:'attr2',
                                    isRequired:false

                                  }}  />
                                  </div>
                                </div>
                              </div>
                              <ActionComponent loading={this.state.loading} clearForm={this.clearForm}></ActionComponent>
                              
                             </div>
                            </form>
                          </TabPanel>
                          <TabPanel tabId="two">
                            <form onSubmit={this.handlePointSubmit}>
                             <div className="box">
                              <div className="box-header with-border">
                                <h3 className="box-title">Points</h3>
                                <div className="pull-right">
                                <button type="button" className="btn btn-primary" onClick={this.addMorePoint}>+</button>
                                </div>
                              </div> 
                              <div className="box-body">
                               {
                                  this.state.route_points.map((val,index)=>{
                                  return (
                                  <PointComponent 
                                        options={this.state.points} 
                                        value={this.state.rpoint[index]} 
                                        SourceChange={this.handlePointSourceChange} 
                                        index={index} key={index} 
                                        remove={this.removeRow} 
                                        distanceFromPrev={val.distanceFromPrev}
                                        timeFromPrev={val.timeFromPrev}
                                        RoutePointInput={this.handleRoutePointInput}
                                        /> 
                                  )
                                  })   
                                  }
                             
                            
                               
                              </div>
                   <ActionComponent loading={this.state.ploading} clearForm={this.clearForm}></ActionComponent>
                            
                             </div>
                            </form>
                          </TabPanel>
                          <TabPanel tabId="three">
                            <p>Tab 3 content</p>
                          </TabPanel>
                        </Tabs>
             
            </section>
          </>

           )
	}
}
export default NewRoute