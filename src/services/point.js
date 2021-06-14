import Api from './api/authapi'


export default {
	
   get (params) {
   	console.log(params);
   	const apiurl = process.env.REACT_APP_URL;
     return Api().get(apiurl+'/point/get',params, {
                       headers: 
                      {
                         'user-type': 'admin',
                        'token': localStorage.getItem('token'),
                       }
                     })

   },
   add (params) {
    console.log(params);
    const apiurl = process.env.REACT_APP_URL;
    return Api().post(apiurl+'/point/add', params, {
                      headers: 
                      {
                        'user-type': 'admin',
                        'token': localStorage.getItem('token'),
                       }
                     })

  },
  uplodaimage(params) {
    console.log(params);
    const apiurl = process.env.REACT_APP_URL_IMG;
    return Api().post(apiurl + '/point/pointImage', params, {
      headers:
      {
        'user-type': 'admin',
        'token': localStorage.getItem('token'),
      }
    })

  },
   update (params) {
    console.log(params);
    const apiurl = process.env.REACT_APP_URL;
    return Api().post(apiurl+'/point/update', params, {
                      headers: 
                      {
                        'user-type': 'admin',
                        'token': localStorage.getItem('token'),
                       }
                     })

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
  get (id) {
    console.log(id);
    const apiurl = process.env.REACT_APP_URL;
    return Api().get(apiurl+'/point/'+id,{
                      headers: 
                      {
                        'user-type': 'admin',
                        'token': localStorage.getItem('token'),
                       }
                     })

  },
  
  getimages (id) {
    console.log(id);
    const apiurl = process.env.REACT_APP_URL_IMG;
    return Api().get(apiurl+'/point/images/all/'+id, {
                      headers: 
                      {
                        'user-type': 'admin',
                        'token': localStorage.getItem('token'),
                       }
                     })

  },
  
  deleteimages (id) {
    console.log(id);
    const apiurl = process.env.REACT_APP_URL_IMG;
    return Api().delete(apiurl+'/point/pointImage', {
                      headers: 
                      {
                        'user-type': 'admin',
                        'token': localStorage.getItem('token'),
                       },
                     data: {
                       ids: id
                     }
                     })

  },
}