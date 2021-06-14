import Api from './api/authapi'


export default {
	
   get (params) {
  	console.log(params);
  	const apiurl = process.env.REACT_APP_URL;
    return Api().post(apiurl+'/document/get', {
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
    return Api().post(apiurl+'/document/add/', params, {
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
    return Api().post(apiurl+'/document/update/'+id, params)

  },
  list (params) {
    console.log(params);
    const apiurl = process.env.REACT_APP_URL;
    return Api().post(
                    apiurl+'/document/all',{},
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
    return Api().get(apiurl+'/document/'+id, {
                      headers: 
                      {
                         'user-type': 'admin',
                        'token': localStorage.getItem('token'),
                       }
                     })

  },
}