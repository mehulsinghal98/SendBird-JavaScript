import {urls} from '../smcBackendActions/urls'

export const smcGetLoginId = (mobileNumber) => {

     return fetch(urls.loginApi, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        mobile: mobileNumber
      })
    });

};

export const smcSubmitOTP = (otp, smc_login_id) => {
    return fetch(urls.loginApi + "/" + smc_login_id + "/confirm", {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        otp: otp
      })
    });

};