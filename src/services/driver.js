import Api from './api/authapi'


export default {

  get(id) {
    console.log(id);
    const apiurl = process.env.REACT_APP_URL;
    return Api().get(apiurl + '/driver/' + id, {
      headers:
      {
        'user-type': 'admin',
        'token': localStorage.getItem('token'),
      }
    })

  },
  add(params) {
    const apiurl = process.env.REACT_APP_URL;
    return Api().post(apiurl + '/driver/add', params, {
      headers:
      {
        'user-type': 'admin',
        'token': localStorage.getItem('token'),
      }
    })

  },
  update(params) {
    console.log(params);
    const apiurl = process.env.REACT_APP_URL;
    return Api().post(apiurl + '/driver/update', params, {
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
    return Api().post(apiurl + '/driver/profileImage', params, {
      headers:
      {
        'user-type': 'admin',
        'token': localStorage.getItem('token'),
      }
    })

  },
  kyc(params) {
    console.log(params);
    const apiurl = process.env.REACT_APP_URL_IMG;
    console.log(apiurl + '/driver/kycImage');
    return Api().post(apiurl + '/driver/kycImage', params, {
      headers:
      {
        'user-type': 'admin',
        'token': localStorage.getItem('token'),
      }
    })

  },
  list(params) {
    console.log(params);
    const data = { 'name': params };
    const apiurl = process.env.REACT_APP_URL;
    return Api().post(
      apiurl + '/driver/all', data,
      {
        headers: {
          'user-type': 'admin',
          'token': localStorage.getItem('token'),
        }
      }
    )

  },
  getUser(id) {
    console.log(id);
    const apiurl = process.env.REACT_APP_URL;
    return Api().get(apiurl + 'driver/' + id, {
      headers:
      {
        'user-type': 'admin',
        'token': localStorage.getItem('token'),
      }
    })

  },
}