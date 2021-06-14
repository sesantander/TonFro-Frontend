import Api from './api/authapi'


export default {
	
  login (credentials) {
  	console.log(credentials);
  	//console.log(process.env);
  	const apiurl = process.env.REACT_APP_URL;
    return Api().post(apiurl+'/user/login', credentials, {
      headers: 
      {
        'userType': 'admin',
       
       }
     })

  }
}