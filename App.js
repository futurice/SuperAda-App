import React from 'react';
import { BackHandler } from 'react-native';
import { AppLoading, Font, Util } from 'expo';
import I18n from 'ex-react-native-i18n';

import { Provider } from 'react-redux';
import store from './src/redux/store';
import persistStore from './src/redux/persist';

import Navigator, {
  handleBackButton,
} from './src/containers/navigator/Navigator';

// JS updates are forced to be done in the background on Android, so we need to
// listen for version updates and relaunch the app if there is an update available.
// On iOS, the most recent JS bundle is downloaded when the app initially starts.
Util.addNewVersionListenerExperimental((manifest) => {
  console.log('New version of app downloaded, restarting:', manifest);
  Util.reload();
});

export default class App extends React.Component {
  state = {
    isReady: false,
  };

  startAsync = async () => {
    // Perform any initialization tasks here while Expo shows its splash screen.
    await persistStore(store);

    await I18n.initAsync();

    await Font.loadAsync('pt-sans', require('./assets/PT_Sans-Web-Bold.ttf'));

    BackHandler.addEventListener('hardwareBackPress', () =>
      handleBackButton(store),
    );
  };

  onFinish = () => this.setState(() => ({ isReady: true }));

  render = () => {
    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={this.startAsync}
          onFinish={this.onFinish}
          onError={console.warn}
        />
      );
    }

    // Render the app only after we're done initializing
    return (
      <Provider store={store}>
        <Navigator />
      </Provider>
    );
  };
}
