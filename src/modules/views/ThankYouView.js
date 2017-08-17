import React, { PropTypes } from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';

import AppStyles from '../AppStyles';

import TranslatedText from '../../components/TranslatedText';
import { getTranslated, texts } from '../../utils/translation';

export class ThankYouView extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TranslatedText style={styles.titleText} text={texts.thankYou} />
          <Image
            style={styles.mark}
            source={require('../../../images/kiitos.png')}
          />
        </View>
        <View style={styles.textContainer}>
          <TranslatedText
            style={styles.textBody}
            text={texts.thankYouForParticipation}
          />
          <TranslatedText
            style={styles.textBody}
            text={texts.thankYouComeAgain}
          />
        </View>
        <View style={styles.regardsContainer}>
          <TranslatedText
            style={styles.bottomText}
            text={texts.thankYouBestRegards}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: AppStyles.darkRed,
  },
  header: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 20,
  },
  titleText: {
    fontSize: AppStyles.titleFontSize,
    fontWeight: 'bold',
    color: AppStyles.white,
  },
  mark: {
    width: 200,
    height: 250,
  },
  textContainer: {
    padding: 35,
    alignItems: 'center',
  },
  textBody: {
    color: AppStyles.white,
    marginBottom: 15,
    fontWeight: 'bold',
    fontSize: AppStyles.fontSize,
  },
  regardsContainer: {
    alignItems: 'center',
  },
  bottomText: {
    fontSize: 20,
    color: AppStyles.white,
    fontWeight: 'bold',
  },
});

export default ThankYouView;
