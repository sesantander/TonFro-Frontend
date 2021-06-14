import React,{Component} from 'react'
// import user from '../../../services/user';
// import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';
// import point from '../../../services/point';
// import { ContentState, EditorState, convertToRaw, convertFromRaw,draftToMarkdown ,convertFromHTML} from 'draft-js';
import { EditorState} from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
// import draftToHtml from 'draftjs-to-html';
// import htmlToDraft from 'html-to-draftjs';


import './service.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
class NewService extends Component{
     constructor(props){
      super(props);

      this.state =  {
                'form': {
                    "name": 'Test',
                    "priority": '1234',
                    "status": '',
                    "content": '<p>html</p>',
                    
                },
                'required': {
                      "name": false,
                      
                      "status": false,
                      "content": false,
                       
                },
                 editorState: EditorState.createEmpty(),

            };
        this.requiredText =  ["name","status","content"];

      
    }
    componentDidMount(){
       let params = this.props.match.params;
       if(typeof params.id!=='undefined'){
        this.getUser(params.id);
      }
     // this.state.editorState = ContentState.createFromBlockArray(convertFromHTML('<p>gcfhg</p>'));
      // const html = `<p>hgvjhh</p>`;
      // const contentBlock = htmlToDraft(html);      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      // const editorState = EditorState.createWithContent(contentState);
      // this.setState({
      //  'editorState':editorState
      // });
  }
    handleUserInput (e) {
    const name = e.target.name;
    const value = e.target.value;
    const form = this.state['form'];
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
   onEditorStateChange = (editorState) => {
    this.setState({
      'editorState':editorState
    });
  };
  handleSubmit = (event) =>{
    event.preventDefault();
    let req = this.state.required;
    this.requiredText.forEach((v)=>{
        if(this.state['form'][v]===''){
           req[v]=true;
           this.setState({
             'required':req
           });
            
        }
        
    });//console.log(draftToHtml(convertToRaw(this.state.editorState.getCurrentContent())));
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
                  <h1>Add Service</h1>
                </div>
                <div className="pull-rigth">
                  <Link
                    className="btn btn-default pull-right"
                    to="/service"
                    data-toggle="tooltip"
                    title="Add Service"
                  >
                    <i className="fa fa-long-arrow-left"></i>Back
                  </Link>
                </div>
              </div>
            </section>
            <section className="content">
              <form onSubmit={this.handleSubmit}>
                <div className="box">
                  <div className="box-header with-border">
                    <h3 className="box-title">Service</h3>
                  </div> 
                  <div className="box-body">
                    <div className="row">
                      <div className="col-md-4">
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
                      <div className="col-md-4">
                        <div className="form-group">
                          <label className="control-label">Priority</label>
                          <input
                            type="text"
                            name="lat"
                            value={this.state["form"].lat}
                            id="lat"
                             
                            autoComplete="off"
                            placeholder="Lat"
                             className={
                              this.state["required"].lat
                                ? "form-control error"
                                : "form-control"
                            }
                            onChange={(e) => this.handleUserInput(e)}
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
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
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group required">
                         <label className="control-label pt_5">Profile Image</label>
                           <label htmlFor="doc_file" className="c_upload" ><i className="fa fa-upload c_upload"></i> Upload
                           <input type="file" className="custome_file" id="doc_file" onChange={this.fileChangedHandler }/>
                         </label>
                        </div>
                      </div>
                      </div>
                    <div className="row">
                      <div className="col-md-12">
                        <div className="form-group required">
                          <label className="control-label">Content</label><br />
                         <Editor
                              editorState={this.state.editorState}
                              toolbarClassName="toolbarClassName"
                              wrapperClassName="editor-class"
                              editorClassName="editorClassName"
                              onEditorStateChange={this.onEditorStateChange}
                            />
                        </div>
                      </div>       
                    </div>
                  <div className="box-footer" style={{ textAlign: "left" }}>
                    <button type="submit" className="btn btn-sm btn-primary mrg-rt">
                      Save
                    </button>
                    <a href="#!" className="btn btn-sm btn-default">
                      Cancel
                    </a>
                  </div>
                </div>
                </div>
              </form>
            </section>
          </>

           )
  }
}
export default NewService