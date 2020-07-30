import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { withFirebase } from '../Firebase';
import { Container, FormGroup, makeStyles, FormControl, Button,
     Input, InputLabel, FormHelperText, Snackbar, Box } from '@material-ui/core';

import * as ROUTES from '../../Constants/routes';

const useStyles = makeStyles((theme) => ({
        errorText: {
            color: 'red'
        },
    })
);

const SignInPage = (props) => {
    const classes = useStyles();
    const [error, setError] = useState('');
    const [open, setOpen] = useState(false);
    const {register, handleSubmit, control, errors } = useForm();

    const onSubmit = data => {
        props.firebase.doSignInWithEmailAndPassword(data.email, data.password).then(() => {
            props.history.push(ROUTES.HOME);
        })
        .catch(error => {
            setError(error.message);
            setOpen(true);
        });
    }

    return (
        <Container>
            <Box>
                <h4>Sign In</h4>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormGroup>
                        <FormControl>
                        <InputLabel>Email</InputLabel>
                        <Input name="email" inputRef={register({ required: true })}/>
                        <FormHelperText>Enter the email you used for registration</FormHelperText>
                        <FormHelperText>{errors.email && <span className={classes.errorText}>Email is required</span>}</FormHelperText>
                        </FormControl>
                    </FormGroup>
                    <FormGroup>
                        <FormControl>
                        <InputLabel>Password</InputLabel>
                        <Input type="password" name="password" inputRef={register({ required: true })}/>
                        <FormHelperText>{errors.password && <span className={classes.errorText}>Password is required</span>}</FormHelperText>
                        </FormControl>
                    </FormGroup>
                    <FormGroup>
                        <Button type="submit" color="inherit">SignIn</Button>
                    </FormGroup>
                    <FormGroup>
                        <p>Don't have an account? Register <Link to={ROUTES.SIGN_UP}>here</Link></p>
                    </FormGroup>
                </form>

                <Snackbar
                    open={open} color='red' autoHideDuration={600} message={error} action={
                        <Button color="inherit" size="small" onClick={() => setOpen(false)}>
                            X
                        </Button>
                    }
                />
            </Box>
        </Container>
    )
}

export default withRouter(withFirebase(SignInPage));