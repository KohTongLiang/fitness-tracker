import React from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom';

import Navigation from '../Navigation';
import WorkoutPage from '../Workout';
import HomePage from '../Home';
import SignInPage from '../AuthControl/SignIn';
import SignUpPage from '../AuthControl/SignUp';
import SchedulePage from '../Schedule';
import HistoryPage from '../History';

import { withAuthentication } from '../Session';
import * as ROUTES from '../../Constants/routes';
import { useMediaQuery, createMuiTheme, ThemeProvider, CssBaseline } from '@material-ui/core';

function App () {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );

  return (
    
    <ThemeProvider theme={theme}>
      <Router>
        <Navigation />
        <Route exact path={ROUTES.HOME} component={HomePage}/>
        <Route path={ROUTES.WORKOUT} component={WorkoutPage} />
        <Route path={ROUTES.SIGN_IN} component={SignInPage} />
        <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
        <Route path={ROUTES.SCHEDULE} component={SchedulePage} />
        <Route path={ROUTES.HISTORY} component={HistoryPage} />
      </Router>
    </ThemeProvider>
  )
}

export default withAuthentication(App);
