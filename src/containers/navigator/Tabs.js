import { TabNavigator, TabBarBottom } from 'react-navigation';
import appConfig from '../../../app.json';

// ## View Imports ##
import WelcomeView from '../views/Welcome';
import TeamView from '../views/Team';
import CheckpointsView from '../views/Checkpoints';
import QuizView from '../views/Quiz';

const TabNavigatorConfig = {
  tabBarOptions: {
    activeTintColor: 'white',
    style: { backgroundColor: 'white', height: 72 },
    activeTintColor: appConfig.expo.primaryColor,
    scrollEnabled: true,
    showLabel: false,
    showIcon: true,
  },
  tabBarComponent: TabBarBottom,
  tabBarPosition: 'bottom',
};

export default TabNavigator(
  {
    Welcome: { screen: WelcomeView },
    Team: { screen: TeamView },
    Checkpoints: { screen: CheckpointsView },
    Quiz: { screen: QuizView },
    // ## End TabNavigator Views ##
  },
  TabNavigatorConfig,
);
