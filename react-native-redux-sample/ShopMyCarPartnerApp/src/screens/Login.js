import React, { Component } from 'react';
import { View, Text, TextInput, Image } from 'react-native';
import { connect } from 'react-redux';
import { initLogin, sendbirdLogin } from '../actions';
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
      userId: '',
      nickname: 'n'
    };
  }

  componentDidMount() {
    this.props.initLogin();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    let { user, error } = this.props;
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
      this.setState({ userId: '', nickname: '', isLoading: false }, () => {
        this.props.navigation.dispatch(resetAction);
      });
    }

    if (error && error !== prevProps.error) {
      this.setState({ isLoading: false });
    }
  }

  _onUserIdChanged = userId => {
    this.setState({ userId });
  };

  _onNicknameChanged = nickname => {
    this.setState({ nickname });
  };

  _onButtonPress = () => {
    const { userId, nickname } = this.state;
    this.setState({ isLoading: true }, () => {
      this.props.sendbirdLogin({ userId, nickname });
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

        <View style={styles.inputViewStyle}>
          <TextInput
            label="Mobile Number"
            placeholder="Mobile Number"
            style={styles.inputStyle}
            value={this.state.userId}
            duration={100}
            autoCorrect={false}
            maxLength={16}
            underlineColorAndroid="transparent"
            onChangeText={this._onUserIdChanged}
          />
        </View>
{/*
        <View style={styles.inputViewStyle}>
         <TextInput
            label="OTP"
            placeholder="OTP"
            style={styles.inputStyle}
            value={this.state.nickname}
            duration={100}
            autoCorrect={false}
            maxLength={16}
            underlineColorAndroid="transparent"
            onChangeText={this._onNicknameChanged}
          />
        </View> */ }

        <View style={styles.buttonStyle}>
          <Button
            //title="Continue"
            icon={{
                        name: 'arrow-right',
                        type: 'font-awesome',
                        color: 'white',
                        size: 14
                      }}
            buttonStyle={{ backgroundColor: '#263673'}}
            onPress={this._onButtonPress}
            disabled={this.state.isLoading}
          />
        </View>

        <Text style={styles.errorTextStyle}>{this.props.error}</Text>

         <Image style={styles.imageStyle} source={login_image} />

      </View>
    );
  }
}

function mapStateToProps({ login }) {
  const { error, user } = login;
  return { error, user };
}

export default connect(
  mapStateToProps,
  { initLogin, sendbirdLogin }
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
    marginTop: 30,
    color : '#263673',
    width : 100,
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
