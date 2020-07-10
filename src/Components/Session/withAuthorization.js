import React from 'react';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../Constants/routes';
import AuthUserContext from './context';

const withAuthorization = condition => Component => {
    class WithAuthorization  extends React.Component {
        componentDidMount() {
            this.listener = this.props.firebase.onAuthUserListener(
              authUser => {
                if (!condition(authUser)) {
                  this.props.history.push(ROUTES.HOME);
                }
              },
              () => this.props.history.push(ROUTES.SIGN_IN),
            );
          }

        componentWillUnmount () {
            this.listener();
        }

        render () {
            return(
                <AuthUserContext.Consumer>
                    { authUser => condition(authUser) ? <Component {...this.props} uid={authUser.uid} /> : null }
                </AuthUserContext.Consumer>
            );
        }
    }

    return withFirebase(withRouter(WithAuthorization ));
}

export default withAuthorization;