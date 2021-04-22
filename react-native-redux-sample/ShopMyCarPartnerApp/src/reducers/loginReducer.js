import { INIT_LOGIN, LOGIN_SUCCESS, LOGIN_FAIL, VALID_NUMBER, INVALID_NUMBER, VALID_OTP, INVALID_OTP} from '../actions/types';

const INITIAL_STATE = {
  error: '',
  user: null,
  smc_login_id: null,
  smc_user_data : null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case INIT_LOGIN:
      return { ...state, ...INITIAL_STATE };
    case LOGIN_SUCCESS:
      return { ...state, ...INITIAL_STATE, user: action.payload };
    case LOGIN_FAIL:
      return { ...state, ...INITIAL_STATE, error: action.payload };
    case VALID_NUMBER:
        return {...state, ...INITIAL_STATE, smc_login_id : action.payload};
    case INVALID_NUMBER:
        return {...state, ...INITIAL_STATE, error : action.payload};
    case VALID_OTP:
        return {...state, ...INITIAL_STATE, smc_user_data : action.payload}
    case INVALID_OTP:
        return {...state, ...INITIAL_STATE, error : action.payload}
    default:
      return state;
  }
};
