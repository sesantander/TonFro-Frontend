import Api from './api/authapi'
import moment from 'moment';

export default {

  get(params) {
    console.log(params);
    const apiurl = process.env.REACT_APP_URL;
    return Api().post(apiurl + 'get', {
      headers:
      {
        'user-type': 'admin',
        'token': localStorage.getItem('token'),
      }
    }, params)

  },
  add(params) {
     
    const apiurl = process.env.REACT_APP_URL;
    return Api().post(apiurl + '/user/admin/addConsumer', params, {
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
    return Api().post(apiurl + '/user/profile/admin', params, {
      headers:
      {
        'user-type': 'admin',
        'token': localStorage.getItem('token'),
      }
    })

  },
  list(params) {
    console.log(params);
    const apiurl = process.env.REACT_APP_URL;
    return Api().post(
      apiurl + '/user/all', {},
      {
        headers:
        {
          'user-type': 'admin',
          'token': localStorage.getItem('token'),
          'Content-Type': 'application/json'
        },
        
      }
      , params)

  },
    filter(params) {
    const apiurl = process.env.REACT_APP_URL;
    return Api().post(apiurl + '/user/filtered', params, {
      headers:
      {
        'user-type': 'admin',
        'token': localStorage.getItem('token'),
      }
    })

  },
  getUser(id) {
    console.log(id);
    const apiurl = process.env.REACT_APP_URL;
    return Api().get(apiurl + '/user/' + id, {
      headers:
      {
        'user-type': 'admin',
        'token': localStorage.getItem('token'),
      }
    })

  },
  recentbooking() {
    const apiurl = process.env.REACT_APP_URL;
    return Api().get(apiurl + '/booking/recentBooking', {
      headers:
      {
        'user-type': 'admin',
        'token': localStorage.getItem('token'),
      }
    })

  },
  todaysbooking() {
    const d = new Date();
    const month = d.getMonth()+1;
    const day = d.getDate();
    let cdate = (month<10 ? '0' : '') + month +'/'+ (day<10 ? '0' : '') + day+'/'+d.getFullYear()
    const apiurl = process.env.REACT_APP_URL;
    return Api().post(apiurl + '/trip/booking/dailyTotalBooking',{date:cdate}, {
      headers:
      {
        'user-type': 'admin',
        'token': localStorage.getItem('token'),
      }
    })

  },
  dashbparddata() {
    const apiurl = process.env.REACT_APP_URL;
    return Api().get(apiurl + '/user/dashboard', {
      headers:
      {
        'user-type': 'admin',
        'token': localStorage.getItem('token'),
      }
    })

  },
  getfeedback(params) {
    console.log(params);
    const apiurl = process.env.REACT_APP_URL;
    return Api().get(apiurl + '/user/feedback', {
      headers:
      {
        'user-type': 'admin',
        'token': localStorage.getItem('token'),
      }
    }, params)

  },
  getnotification() {
   
    const apiurl = process.env.REACT_APP_URL;
    return Api().post(apiurl + '/user/notification/all', {
      "limit":10,
      "offset": 0
    }, {
      headers:
      {
        'user-type': 'admin',
        'token': localStorage.getItem('token'),
      }
    })

  },
  dashboarddata(params) {
    console.log(params);
    const apiurl = process.env.REACT_APP_URL;
    return Api().get(apiurl + '/user/dashboard', {
      headers:
      {
        'user-type': 'admin',
        'token': localStorage.getItem('token'),
      }
    }, params)

  },
  getGraphData() {
    const year1 = moment().format('YYYY');
    const todate = moment(new Date(), "MM/DD/YYYY").format("MM/DD/YYYY");
   let dates = {
      "fromDate": `01/01/${year1}`,
      "toDate": todate
    }
    const apiurl = process.env.REACT_APP_URL;
    return Api().post(apiurl + '/trip/booking/totalBooking',dates, {
      headers:
      {
        'user-type': 'admin',
        'token': localStorage.getItem('token'),
      }
    })

  },
  downloadExcel() { 
    const apiurl = process.env.REACT_APP_URL;
    return Api().get(apiurl + '/user/customer/excel', {
      headers:
      {
        'user-type': 'admin',
        'token': localStorage.getItem('token'),
        'Content-Type': 'application/vnd.openxmlformats'
      },
      responseType: 'blob',
      
    })

  },
  uplodaimage(params) {
    console.log(params);
    const apiurl = process.env.REACT_APP_URL_IMG;
    return Api().post(apiurl + '/user/profileImage/admin', params, {
      headers:
      {
        'user-type': 'admin',
        'token': localStorage.getItem('token'),
      }
    })

  },
  broadCastmessage(params) {
    const apiurl = process.env.REACT_APP_URL;
    return Api().post(apiurl + '/user/notification/send', params, {
      headers:
      {
        'user-type': 'admin',
        'token': localStorage.getItem('token'),
      }
    })

  },
  todayBooking(params) {
    const apiurl = process.env.REACT_APP_URL;
    return Api().post(apiurl + '/trip/booking/allJourneyBooking', params, {
      headers:
      {
        'user-type': 'admin',
        'token': localStorage.getItem('token'),
      }
    })

  },
  checkSuperAdmin(params) {
    console.log(params);
    const apiurl = process.env.REACT_APP_URL;
    return Api().post(apiurl + '/user/checkSuperAdmin' ,params,{
      headers:
      {
        'user-type': 'admin',
        'token': localStorage.getItem('token'),
      }
    }, params)

  },
}