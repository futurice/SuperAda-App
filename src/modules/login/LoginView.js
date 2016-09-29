import React, {PropTypes} from 'react';

import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity
} from 'react-native';

import * as NavigationState from '../../modules/navigation/NavigationState';

const LoginView = React.createClass({


    _userLogin() {
      fetch('http://localhost:3000/teams/authenticate', {
        method: 'POST',
        body: JSON.stringify({
          name: this.state.username,
        })
      })
      .then((response) => response.json())
      .then(response => {
      console.log(response)
      this.setState({teamid:response.teamID, teamname:response.teamname})
    })
  },

  popRoute(){
  this.props.dispatch(NavigationState.popRoute({
        key: 'CounterView',
       }));
    },

  propTypes: {
    dispatch: PropTypes.func.isRequired
  },

  getInitialState: function() {
    return {
      username: '',
      teamid: '',
      teamname: '',
      background: `rgba(250,155,145,1)`
    }
  },

  render: function() {




    return (



      <View style={[styles.container, {backgroundColor: this.state.background}]}>
      <View style={styles.header}>
              <Image style={styles.mark} source={require('../../../images/superada_transparent.png')}/>
          </View>
          <View style={styles.inputs}>
            <View style={styles.inputContainer}>
               <Text style={styles.textstyle}>Joukkueen nimi:</Text>
            <TextInput
                    style={[styles.input, styles.whiteFont]}
                    onChangeText={(username) => this.setState({username})}
                    value={this.state.username}
                    />
            </View>
          </View>

          <View style={styles.signin}>
          <TouchableOpacity onPress={this._userLogin}>
              <Text style={styles.whiteFont}>KIRJAUDU SISÄÄN</Text>
              </TouchableOpacity>
          </View>
          <Text style={styles.debug}>TeamID: {this.state.teamid}</Text>
          <Text style={styles.debug}>Team Name: {this.state.teamname}</Text>
      </View>

    );

  }

});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
      flex: 1,
      backgroundColor: 'transparent'
  },
  bg: {
          position: 'absolute',
          left: 0,
          top: 0
      },
      header: {
          justifyContent: 'flex-start',
          alignItems: 'center',
          flex: 0,
          backgroundColor: 'transparent'
      },
      mark: {
          width: 150,
          height: 150
      },
      signin: {
          backgroundColor: '#ff5454',
          padding: 20,
          marginLeft: 30,
          marginRight: 30,
          marginBottom: 90,
          alignItems: 'center'
      },
      signup: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: .15
      },
      inputs: {
        marginTop: 2,
        marginBottom: 2,
          flex: .25
      },
      inputPassword: {
          marginLeft: 15,
          width: 20,
          height: 21
      },
      inputUsername: {
        marginLeft: 15,
        width: 20,
        height: 20
      },
      inputContainer: {
          padding: 35,
          borderWidth: 1,
          borderColor: 'transparent'
      },
      input: {
          position: 'absolute',
          left: 30,
          top: 60,
          right: 30,
          height: 45,
          fontSize: 20
      },
      forgotContainer: {
        alignItems: 'flex-end',
        padding: 8
      },
      greyFont: {
        color: '#D8D8D8'
      },
      whiteFont: {
        color: '#FFF'
      },
      textstyle: {
        color: '#FFF',
        marginBottom: 15
      },
      debug: {
        color: '#FFF',
        marginBottom: 15,
        marginLeft: 20
      }
});
export default LoginView;
