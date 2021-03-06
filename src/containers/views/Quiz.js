import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  StatusBar,
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import Dimensions from 'Dimensions';

import { connect } from 'react-redux';
import rest from '../../utils/rest';

import Puzzle from '../puzzle/Puzzle';
import * as GameState from '../../state/game';
import AppStyles from '../../AppStyles';

import TranslatedText from '../../components/TranslatedText';
import { texts } from '../../utils/translation';
import I18n from 'ex-react-native-i18n'
import * as Config from '../../Config';

const resetGame = component => event => {
  event.preventDefault();

  const { deleteGame, initialiseGame } = component.props;

  deleteGame();
  initialiseGame();
};

const startGame = component => event => {
  event.preventDefault();

  const { resumeGame } = component.props;

  resumeGame();
};

const togglePause = component => event => {
  event.preventDefault();

  const { pauseGame, resumeGame, gameState } = component.props;

  const { gameStatus } = gameState;

  if (gameStatus === GameState.GAME_PAUSE) {
    resumeGame();
  } else {
    pauseGame();
  }
};

const mapStateToProps = state => ({
  gameState: state.gameState,
  quizStatus: state.quiz,
});
const mapDispatchToProps = dispatch => ({
  initialiseGame: () => dispatch(GameState.initGame()),
  refresh: () => dispatch(rest.actions.quiz.sync()),
  deleteGame: () => dispatch(rest.actions.quiz.delete()),
  pauseGame: () => dispatch(GameState.gamePause()),
  resumeGame: () => dispatch(GameState.gameResume()),
});

export class GameView extends Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    title: 'Super-Ada Quiz!',
    header: null,
    swipeEnabled: false,
    tabBarIcon: ({ tintColor }) =>
      <Image
        source={require('../../../assets/muutiso_transparent.png')}
        style={[AppStyles.icon, { tintColor: tintColor }]}
      />,
  });

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const { initialiseGame, gameState, refresh } = this.props;

    const { gameStatus } = gameState;

    refresh();

    if (gameStatus === GameState.NO_GAME) {
      initialiseGame();
    }
  }

  // TODO: render grew too big
  render() {
    const { gameState, quizStatus } = this.props;
    const { puzzle, solution, gameStatus, wordsToFind, timer } = gameState;

    let contentView;
    const remaining = Config.timelimit - timer;
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining - minutes * 60;

    var time = {
      minutes: minutes,
      seconds: seconds,
    };

    let timerText = I18n.t(texts.quizTime, time);
    let pausedText =
      gameStatus === GameState.GAME_PAUSE
        ? I18n.t(texts.quizTimerPause)
        : '';

    timerText += pausedText;

    // If server thinks we're done, but redux store state says we're not,
    // show total points from server and offer to restart
    if (
      !quizStatus.loading &&
      quizStatus.data.done &&
      gameStatus !== GameState.GAME_COMPLETED
    ) {
      return this.renderQuizEnd();
    }

    switch (gameStatus) {
      case GameState.GAME_CREATED: {
        contentView = (
          <View style={styles.gameContainer}>
            <View style={styles.welcomeContainer}>
              <TranslatedText
                style={styles.titleText}
                text={texts.quizTitle}
              />
              <TranslatedText
                style={styles.welcomeText}
                text={texts.quizWelcome}
              />
              <TranslatedText
                style={styles.welcomeText}
                text={texts.quizExplanation}
              />
              <TranslatedText
                style={styles.welcomeText}
                text={texts.quizTimelimit}
              />
              <TranslatedText
                style={styles.welcomeText}
                text={texts.quizYouCanTryMultipleTimes}
              />
            </View>
            <TouchableOpacity style={styles.button} onPress={startGame(this)}>
              <TranslatedText
                style={styles.buttonText}
                text={texts.quizStart}
              />
            </TouchableOpacity>
          </View>
        );

        break;
      }
      case GameState.GAME_PAUSE:
      case GameState.GAME_RUNNING: {
        contentView = (
          <View style={styles.gameContainer}>
            <View style={styles.headerContainer}>
              <TranslatedText
                style={styles.wordsToFind}
                text={texts.quizWordsLeft}
                wordsToFind={wordsToFind || solution.found.length}
              />
              <Text style={styles.timer}>
                {timerText}
              </Text>
            </View>
            <Puzzle
              puzzle={puzzle}
              solution={solution}
              gameStatus={gameStatus}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={togglePause(this)}
              >
                <TranslatedText
                  style={styles.buttonText}
                  text={
                    gameStatus === GameState.GAME_RUNNING
                      ? texts.quizPause
                      : texts.quizContinue
                  }
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={
                  gameStatus === GameState.GAME_RUNNING
                    ? styles.buttonDisabled
                    : styles.button
                }
                disabled={gameStatus === GameState.GAME_RUNNING}
                onPress={resetGame(this)}
              >
                <TranslatedText
                  style={styles.buttonText}
                  text={texts.quizRetry}
                />
              </TouchableOpacity>
            </View>
          </View>
        );

        break;
      }
      case GameState.GAME_COMPLETED: {
        // TODO: move this into a config
        const pointsPerMinute = 10;
        const pointsPerWord = 5;
        const pointsCompleted = 100;
        const maxMinutes = 10;
        const puzzleCompleted = wordsToFind === 0;

        // Points per minutes
        const minutesPoints = Math.max(minutes * pointsPerMinute, 0);
        const wordsFound = solution.found.length - wordsToFind;
        const wordsPoints = wordsFound * pointsPerWord;
        const pointsIfCompleted = puzzleCompleted ? pointsCompleted : 0;
        const totalPoints = Math.round(
          pointsIfCompleted + wordsPoints + minutesPoints,
        );

        contentView = (
          <View style={styles.gameContainer}>
            <TranslatedText
              style={styles.congratsText}
              text={`${puzzleCompleted
                ? texts.quizEndCongraz
                : texts.quizEndTimeOver}`}
            />
            <TranslatedText
              style={styles.congratsBodyText}
              text={texts.quizEndMinutesBeforeTimeLimit}
              minutes={minutes}
              minutesPoints={minutesPoints}
            />
            <TranslatedText
              style={styles.congratsBodyText}
              text={texts.quizEndWordsFound}
              wordsFound={wordsFound}
              pointsPerWord={pointsPerWord}
              wordsPoints={wordsPoints}
            />
            <TranslatedText
              style={styles.congratsBodyText}
              text={
                puzzleCompleted ?
                  texts.quizEndAllWordsFound :
                  texts.quizEndAllWordsNotFound
              }
              pointsCompleted={pointsCompleted}
            />
            <TranslatedText
              style={styles.congratsBodyText}
              text={texts.quizEndTotalScore}
              points={totalPoints}
            />
            <TranslatedText
              style={styles.retryText}
              text={texts.quizEndYouCanTryAgain}
            />
            <TouchableOpacity
              style={[{ marginTop: 10 }, styles.button]}
              onPress={resetGame(this)}
            >
              <TranslatedText
                style={styles.buttonText}
                text={texts.quizRetry}
              />
            </TouchableOpacity>
          </View>
        );

        break;
      }

      case GameState.NO_GAME:
      default: {
        contentView = (
          <ActivityIndicator
            animating
            style={styles.activityIndicator}
            size="large"
          />
        );
      }
    }

    return (
      <View style={styles.gameContainer}>
        {contentView}
      </View>
    );
  }

  renderQuizEnd() {
    const { quizStatus } = this.props;
    return (
      <View style={styles.gameContainer}>
        <TranslatedText
          style={styles.congratsText}
          text={texts.quizEndCongraz}
        />
        <TranslatedText
          style={styles.congratsBodyText}
          text={texts.quizEndCompleted}
        />
        <TranslatedText
          style={styles.congratsBodyText}
          text={texts.quizEndTotalScore}
          points={quizStatus.data.points}
        />
        <TranslatedText
          style={styles.retryText}
          text={texts.quizYouCanTryMultipleTimes}
        />
        <TouchableOpacity
          style={[{ marginTop: 10 }, styles.button]}
          onPress={resetGame(this)}
        >
          <TranslatedText style={styles.buttonText} text={texts.quizRetry} />
        </TouchableOpacity>
      </View>
    );
  }
}

GameView.propTypes = {
  puzzle: PropTypes.array,
  solution: PropTypes.object,
  gameState: PropTypes.object.isRequired,
  initialiseGame: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
  quizStatus: PropTypes.object.isRequired,
};

const centered = {
  alignSelf: 'center',
};

const styles = StyleSheet.create({
  titleText: {
    paddingTop: StatusBar.currentHeight + Platform.OS === 'ios' ? 20 : 0,
    fontSize: AppStyles.titleFontSize,
    color: AppStyles.white,
    textAlign: 'center',
  },
  gameContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: AppStyles.darkRed,
  },
  welcomeContainer: {
    marginVertical: 20,
  },
  activityIndicator: {
    ...centered,
  },
  headerContainer: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingLeft: 10,
    paddingRight: 10,
  },
  wordsToFind: {
    color: AppStyles.white,
    fontSize: AppStyles.fontSize,
    textAlign: 'center',
  },
  timer: {
    color: AppStyles.white,
    fontSize: AppStyles.fontSize,
    textAlign: 'center',
  },
  congratsText: {
    paddingTop: 20,
    marginBottom: 40,
    fontSize: AppStyles.titleFontSize,
    color: AppStyles.white,
    textAlign: 'center',
  },
  congratsBodyText: {
    ...centered,
    color: AppStyles.white,
    marginTop: 10,
    paddingHorizontal: 20,
    textAlign: 'center',
    fontSize: AppStyles.fontSize,
  },
  retryText: {
    ...centered,
    color: AppStyles.white,
    marginTop: 10,
    paddingHorizontal: 20,
    textAlign: 'center',
    fontSize: AppStyles.fontSize,
  },
  welcomeText: {
    ...centered,
    color: AppStyles.white,
    marginTop: 10,
    paddingHorizontal: 20,
    textAlign: 'center',
    fontSize: AppStyles.fontSize,
  },
  button: {
    backgroundColor: AppStyles.lightRed,
    alignItems: 'center',
    justifyContent: 'center',
    width: Dimensions.get('window').width / 2 - 40,
    elevation: 2,
    height: 70,
    marginTop: 13,
    marginHorizontal: 20,
  },
  buttonDisabled: {
    backgroundColor: AppStyles.darkRed,
    alignItems: 'center',
    justifyContent: 'center',
    width: Dimensions.get('window').width / 2 - 40,
    elevation: 2,
    height: 70,
    marginTop: 13,
    marginHorizontal: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  buttonText: {
    color: AppStyles.white,
    fontSize: AppStyles.fontSize,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(GameView);
