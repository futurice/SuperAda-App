import React, { PropTypes } from 'react';
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
  StatusBar,
  Platform,
  AsyncStorage,
  ActivityIndicator,
} from 'react-native';

import AppStyles from '../AppStyles';

export class LoginView extends React.Component {
  state = {
    teamname: '',
  };

  errToString(err) {
    if (!err) {
      return '';
    }

    if (err.message) {
      return err.message;
    }

    return String(err);
  }

  renderDevLoginButton() {
    return (
      <View style={styles.loginButtonContainer}>
        <TouchableOpacity
          disabled={this.props.auth.loading}
          onPress={() => this.props.login('TeamAwesome')}
          style={
            this.props.auth.loading
            ? styles.loginButtonLoading
            : styles.loginButton
          }
          >
          <Text style={styles.whiteFont}>DEV LOGIN</Text>
        </TouchableOpacity>
        {this.props.auth.loading &&
          <ActivityIndicator
            animating={true}
            color={AppStyles.white}
            style={{
              zIndex: 1000,
              position: 'absolute',
              height: 70,
              width: 70,
            }}
            size="large"
          />
        }
      </View>
    );
  }

  renderLoginButton() {
    return (
      <View style={styles.loginButtonContainer}>
        <TouchableOpacity
          disabled={this.props.auth.loading}
          onPress={() => this.props.login(this.state.teamname)}
          style={
            this.props.auth.loading
            ? styles.loginButtonLoading
            : styles.loginButton
          }
          >
          <Text style={styles.whiteFont}>KIRJAUDU SISÄÄN</Text>
        </TouchableOpacity>
        {this.props.auth.loading &&
          <ActivityIndicator
            animating={true}
            color={AppStyles.white}
            style={{
              zIndex: 1000,
              position: 'absolute',
              height: 70,
              width: 70,
            }}
            size="large"
          />
        }
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor={AppStyles.darkRed}
          animated={false}
          barStyle="light-content"
        />
        <ScrollView
          style={{ flex: 1, alignSelf: 'stretch' }}
          contentContainerStyle={{
            alignItems: 'center',
          }}
        >
          <Image
            style={styles.logo}
            source={require('../../../images/superada_transparent.png')}
          />
          <View style={styles.inputContainer}>
            <Text style={styles.whiteFont}>Joukkueen nimi:</Text>
            <TextInput
              style={[styles.input, styles.whiteFont]}
              onChangeText={teamname => this.setState({ teamname })}
              value={this.state.teamname}
              autoCorrect={false}
              underlineColorAndroid="#000"
              selectionColor="#000"
            />
          </View>
          <View style={styles.errContainer}>
            <Text style={styles.whiteFont}>
              {this.errToString(this.props.auth.error)}
            </Text>
          </View>
        </ScrollView>

        { this.renderLoginButton() }
        { __DEV__ && this.renderDevLoginButton() }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1,
    backgroundColor: AppStyles.darkRed,
  },
  header: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 0,
    backgroundColor: 'transparent',
  },
  logo: {
    marginVertical: 40,
    width: 200,
    height: 200,
  },
  errContainer: {
    flexGrow: 1,
  },
  loginButtonContainer: {
    backgroundColor: AppStyles.darkRed,
    elevation: 5,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    height: 70,
    margin: 20,
  },
  loginButton: {
    backgroundColor: AppStyles.lightRed,
    alignItems: 'center',
    alignSelf: 'stretch',
    height: 70,
    padding: 20,
  },
  loginButtonLoading: {
    backgroundColor: AppStyles.darkRed,
    alignItems: 'center',
    alignSelf: 'stretch',
    height: 70,
    padding: 20,
  },
  inputContainer: {
    marginHorizontal: 35,
    alignSelf: 'stretch',
    ...Platform.select({
      ios: {
        borderBottomWidth: 1,
      },
    }),
  },
  input: {
    height: 45,
    fontSize: AppStyles.fontSize,
  },
  whiteFont: {
    fontSize: AppStyles.fontSize,
    color: AppStyles.white,
  },
  debug: {
    color: AppStyles.white,
    marginBottom: 15,
    marginLeft: 20,
  },
});

import { connect } from 'react-redux';
import rest from '../../utils/rest';

export default connect(
  state => ({
    auth: state.auth,
  }),
  dispatch => ({
    login(name) {
      dispatch(
        rest.actions.auth(
          {},
          {
            body: JSON.stringify({
              name: name.trim(),
            }),
          },
        ),
      );
    },
  }),
)(LoginView);
