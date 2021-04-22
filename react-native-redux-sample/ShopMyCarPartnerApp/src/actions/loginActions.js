import { INIT_LOGIN, LOGIN_SUCCESS, LOGIN_FAIL, VALID_NUMBER, INVALID_NUMBER, VALID_OTP, INVALID_OTP } from './types';
import { sbConnect } from '../sendbirdActions';
import {smcGetLoginId, smcSubmitOTP} from '../smcBackendActions';

export const initLogin = () => {
  return { type: INIT_LOGIN };
};

export const sendbirdLogin = ({ userId, nickname }) => {
  return dispatch => {
    return sbConnect(userId, nickname)
      .then(user => loginSuccess(dispatch, user))
      .catch(error => loginFail(dispatch, error));
  };
};

export const smcLogin = (mobileNumber, callback) => {

    return dispatch => {
        return smcGetLoginId(mobileNumber)
            .then(response => response.json())
            .then(json => {
            smcValidNumber(dispatch,json.data.login_id);
            //console.log(json);
            callback();
            } )
            .catch( (error) => {
            smcInvalidNumber(dispatch,error);
            console.error(error);

            });
    };
};

export const smcConfirmOTP = (otp,smc_login_id ,callback) => {

    return dispatch => {
        return smcSubmitOTP(otp,smc_login_id)
            .then(response => response.json())
            .then(json => {
            smcValidOTP(dispatch,json.data);
            //console.log(json);
            callback();
            } )
            .catch( error => {
            smcInvalidOTP(dispatch,error);
            console.error(error);

            });
    };
};

const loginFail = (dispatch, error) => {
  dispatch({
    type: LOGIN_FAIL,
    payload: error
  });
};

const loginSuccess = (dispatch, user) => {
  dispatch({
    type: LOGIN_SUCCESS,
    payload: user
  });
};

const smcValidNumber = (dispatch,login_id) => {

    dispatch({
        type : VALID_NUMBER,
        payload : login_id
    });
};

const smcInvalidNumber = (dispatch, error) => {

    dispatch({
        type : INVALID_NUMBER,
        payload : error
    });
};

const smcValidOTP = (dispatch,data) => {

    dispatch({
        type : VALID_OTP,
        payload : data
    });


};

const smcInvalidOTP = (dispatch, error) => {

    dispatch({
        type : INVALID_OTP,
        payload : error
    });
};
