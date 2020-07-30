import React from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom';

import Navigation from '../Navigation';
import WorkoutPage from '../Workout';
import HomePage from '../Home';
import SignInPage from '../AuthControl/SignIn';
import SignUpPage from '../AuthControl/SignUp';
import SchedulePage from '../Schedule';

import { withAuthentication } from '../Session';
import * as ROUTES from '../../Constants/routes';

const App = () => (
  <Router>
    <Navigation />
    <Route exact path={ROUTES.HOME} component={HomePage}/>
    <Route path={ROUTES.WORKOUT} component={WorkoutPage} />
    <Route path={ROUTES.SIGN_IN} component={SignInPage} />
    <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
    <Route path={ROUTES.SCHEDULE} component={SchedulePage} />
  </Router>
)

export default withAuthentication(App);
