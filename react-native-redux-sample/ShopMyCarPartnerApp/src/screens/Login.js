import React, { Component } from 'react';
import { View, Text, TextInput, Image } from 'react-native';
import { connect } from 'react-redux';
import { initLogin, sendbirdLogin, smcLogin, smcConfirmOTP } from '../actions';
import { sbRegisterPushToken } from '../sendbirdActions';
import { NavigationActions, StackActions } from 'react-navigation';
import { Button, Spinner } from '../components';
import firebase from 'react-native-firebase';
import login_image from '../img/login_image.jpg';
import image from '../img/icon_sb_34.png';
import Icon from 'react-native-vector-icons/FontAwesome';
//import imager from '../img/logo.png';

class Login extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      mobileNumber: '',
      otp: '',
      showMobileNumberBox : true
    };
  }

  componentDidMount() {
    this.props.initLogin();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    let { user, error, smc_login_id } = this.props;

    if (user && user !== prevProps.user) {
      firebase
        .messaging()
        .getToken()
        .then(pushToken => {
          if (pushToken) {
            sbRegisterPushToken(pushToken)
              .then(res => {})
              .catch(err => {});
          }
        });
      const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Menu' })]
      });
      this.setState({ userId: '', isLoading: false }, () => {
        this.props.navigation.dispatch(resetAction);
      });
    }

    if (error && error !== prevProps.error) {
      this.setState({ isLoading: false });
    }
  }

  _onMobileNumberChanged = mobileNumber => {
    this.setState({ mobileNumber });
  };

  _onOtpChanged = otp => {
    this.setState({ otp });
  };

//  _onButtonPress = () => {
//    const { mobileNumber, nickname } = this.state;
//    this.setState({ showMobileNumberBox : false }, () => {
//  //    this.props.sendbirdLogin({ userId : mobileNumber, nickname });
//    });
//  };

  _onMobileNumberSubmit = () => {
    const { mobileNumber} = this.state;

      this.props.smcLogin("+91"+mobileNumber, () => {
      this.setState({ showMobileNumberBox : false });
      //console.log("Mobil");
      });
  };

  _onOtpSubmit = () => {
    const {otp} = this.state;
    const {smc_login_id} = this.props;

    this.props.smcConfirmOTP(otp,smc_login_id, () => {
    //console.log(this.props.smc_user_data);
        const {mobile,first_name} = this.props.smc_user_data.showroom_staff;
        this.setState({isLoading: true}, () => {
            this.props.sendbirdLogin({userId : mobile, nickname : first_name})
        });
    });



   };



  render() {
    return (
      <View style={styles.containerStyle}>
        <Spinner visible={this.state.isLoading} />
        <View style={styles.logoViewStyle}>
         <Text style={styles.logoTextTitle}>Welcome to</Text>
         <Text style={styles.companyNameStyle}>ShopMyCar</Text>
         <Text style={styles.logoTextTitle}>Partner App</Text>
          <Text style={styles.logoTextSubTitle}>Use the login credentials provided by your</Text>
          <Text style={styles.logoTextSubTitle}>manager/supervisor to login below</Text>
        </View>

        {this.state.showMobileNumberBox ? (
        <View style={styles.inputViewStyle}>
          <TextInput
            label="Mobile Number"
            placeholder="Enter Mobile Number"
            keyboardType='numeric'
            style={styles.inputStyle}
            value={this.state.mobileNumber}
            duration={100}
            autoCorrect={false}
            maxLength={16}
            underlineColorAndroid="transparent"
            onChangeText={this._onMobileNumberChanged}
          />
        </View>
        ) : (
        <View style={styles.inputViewStyle}>
         <TextInput
            label="OTP"
            placeholder="Enter OTP"
            keyboardType='numeric'
            style={styles.inputStyle}
            value={this.state.otp}
            duration={100}
            autoCorrect={false}
            maxLength={16}
            underlineColorAndroid="transparent"
            onChangeText={this._onOtpChanged}
          />
        </View>
        )}

        <View style={styles.buttonStyle}>
          <Button
            title={this.state.showMobileNumberBox? "Send OTP" : "Login"}
//            icon={{
//                        name: 'arrow-right',
//                        type: 'font-awesome',
//                        color: 'white',
//                        size: 14,
//
//                      }}
            buttonStyle={{ backgroundColor: '#263673', alignItems:'center'}}
            onPress={this.state.showMobileNumberBox? this._onMobileNumberSubmit : this._onOtpSubmit}
            disabled={this.state.isLoading}
          />
        </View>

{/*        <Text style={styles.errorTextStyle}>{this.props.error}</Text>  */}

         <Image style={styles.imageStyle} source={login_image} />

      </View>
    );
  }
}

function mapStateToProps({ login }) {
  const { error, user, smc_login_id, smc_user_data } = login;
  return { error, user, smc_login_id, smc_user_data };
}

export default connect(
  mapStateToProps,
  { initLogin, sendbirdLogin, smcLogin, smcConfirmOTP }
)(Login);

const styles = {
  containerStyle: {
    backgroundColor: '#fff',
    marginTop: 80,
    flex: 1
  },
  companyNameStyle :{
      color : '#263673',
      fontSize: 40,
      fontWeight: '600',
      marginTop: -15
  },
  logoViewStyle: {
    //marginTop: 35,
    marginBottom: 5,
    alignItems: 'center',
    marginLeft:50,
    marginRight : 50
  },
  logoTextTitle: {
    //color: '#7d62d9',
    color : '#263673',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15
  },
  logoTextSubTitle: {
    color: '#263673',
    fontSize: 13,
    fontWeight: '500',


  },
  inputViewStyle: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingLeft: 8,
    paddingRight: 8,
    marginLeft: 28,
    marginRight: 28,
    marginTop: 8
  },
  inputStyle: {
    fontSize: 13,
    backgroundColor: '#fff'
  },
  buttonStyle: {
    paddingLeft: 12,
    paddingRight: 12,
    marginTop: 20,
    marginBottom : 20,
    color : '#263673',
    //width : 100,
    alignSelf : 'center',
    alignItems : 'center'
//    backgroundImage: image
  },
  errorTextStyle: {
    alignSelf: 'center',
    fontSize: 12,
    color: '#e03131'
  },
  footerViewStyle: {
    paddingLeft: 28,
    paddingRight: 28,
    marginTop: 15,
    flexDirection: 'column'
  },

  imageStyle : {
  width: '100%',
  height: 400,
  alignSelf : 'center'
  }
};
