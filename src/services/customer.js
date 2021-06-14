import Api from './api/authapi'



export default {
	
   get (params) {
  	console.log(params);
  	const apiurl = process.env.REACT_APP_URL;
    return Api().post(apiurl+'/point/get', {
                      headers: 
                      {
                        'user-type': 'admin',
                         'token': localStorage.getItem('token'),
                       }
                     }, params)

  },
   add (params) {
    console.log(params);
    const apiurl = process.env.REACT_APP_URL;
    return Api().post(apiurl+'/point/add/', params, {
                      headers: 
                      {
                        'user-type': 'admin',
                         'token': localStorage.getItem('token'),
                       }
                     })

  },
   update (params,id) {
    console.log(params);
    const apiurl = process.env.REACT_APP_URL;
    return Api().post(apiurl+'/point/update/'+id, params)

  },
  list (params) {
    console.log(params);
    const apiurl = process.env.REACT_APP_URL;
    return Api().post(
                    apiurl+'/point/all',{},
                   {
                   headers: {
                        'user-type': 'admin',
                         'token': localStorage.getItem('token'),
                       }
                     }
                     )

  },
  getUser (id) {
    console.log(id);
    const apiurl = process.env.REACT_APP_URL;
    return Api().get(apiurl+'/point/'+id, {
                      headers: 
                      {
                        'user-type': 'admin',
                         'token': localStorage.getItem('token'),
                       }
                     })

  },
}