import React, { useState, useEffect } from 'react';
import { withFirebase } from '../Firebase';
import { useForm, Controller } from 'react-hook-form';
import zxcvbn from 'zxcvbn';
import { Container, Box, FormGroup, FormControl, Button,
    Input, InputLabel, FormHelperText, Snackbar, makeStyles,
    Radio, RadioGroup, FormControlLabel, FormLabel, LinearProgress  } from '@material-ui/core';
import * as ROUTES from '../../Constants/routes';

const useStyles = makeStyles((theme) => ({
        errorText: {
            color: 'red'
        },
    })
);

function SignUpPage (props) {
    const {register, handleSubmit, control, errors } = useForm();
    const [open, setOpen] = useState(false);
    const [authError, setAuthError] = useState('');
    const classes = useStyles();
    const dbRef = props.firebase.getFirestore().collection('users');
    const [passwordStrength, setPasswordStrength] = useState(0);
    const passwordStrengthIndicator = ['very weak', 'weak', 'weak', 'medium', 'strong'];


    const onSubmit = data => {
        if (data.passwordOne === data.passwordTwo) {
            props.firebase.doCreateUserWithEmailAndPassword(data.email, data.passwordOne).then(authUser => {
                dbRef.doc(authUser.user.uid).set(data);
                props.history.push(ROUTES.HOME);
            }).catch(error => {
                setAuthError(error.message);
                setOpen(true);
            });
        } else {
            setAuthError('Please ensure password matches.');
            setOpen(true);
        }
    }
    return (
        <Container>
            <h4>Sign Up</h4>
            <Box>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormGroup>
                        <FormControl>
                            <InputLabel>Username</InputLabel>
                            <Input name="username" inputRef={register({ required: true })}/>
                            <FormHelperText>Enter the name you wish to be known by.</FormHelperText>
                            <FormHelperText>{errors.username && <span className={classes.errorText}>Username is required</span>}</FormHelperText>
                        </FormControl>
                    </FormGroup>
                    <FormGroup>
                        <FormControl>
                            <InputLabel>Email</InputLabel>
                            <Input name="email" inputRef={register({ required: true })}/>
                            <FormHelperText>Enter the email you wish to register your account with</FormHelperText>
                            <FormHelperText>{errors.email && <span className={classes.errorText}>Email is required</span>}</FormHelperText>
                        </FormControl>
                    </FormGroup>
                    <FormGroup>
                        <FormControl>
                            <InputLabel>Password</InputLabel>
                            <Input name="passwordOne" type="password" onChange={event => setPasswordStrength(zxcvbn(event.target.value))} inputRef={register({required: true})} />
                            <FormHelperText>{errors.passwordOne && <span className={classes.errorText}>Password is required</span>}</FormHelperText>
                            <div>
                                <LinearProgress  variant="determinate" value={(passwordStrength.score / 4) *100} />
                                <FormHelperText>Password Strength: {passwordStrengthIndicator[(passwordStrength.score)]}</FormHelperText>
                            </div>
                        </FormControl>
                    </FormGroup>
                    <FormGroup>
                        <FormControl>
                            <InputLabel>Confirm Password</InputLabel>
                            <Input name="passwordTwo" type="password" inputRef={register({required: true})} />
                            <FormHelperText>{errors.passwordTwo && <span className={classes.errorText}>Please confirm your password is required</span>}</FormHelperText>
                        </FormControl>
                    </FormGroup>
                    <FormGroup>
                        <FormControl>
                            <FormLabel component="legend">Gender</FormLabel>
                                <Controller as={RadioGroup} control={control} aria-label="gender" name="gender" rules={{required: true}}>
                                    <FormControlLabel value="female" control={<Radio />} label="Female" />
                                    <FormControlLabel value="male" control={<Radio />} label="Male" />
                                    <FormControlLabel value="other" control={<Radio />} label="Other" />
                                </Controller>
                            <FormHelperText>{errors.gender && <span className={classes.errorText}>Please confirm your password is required</span>}</FormHelperText>
                        </FormControl>
                    </FormGroup>
                    <FormGroup>
                        <Button type="submit">
                            Sign Up
                        </Button>
                    </FormGroup>
                </form>
                <Snackbar
                    open={open} color='red' autoHideDuration={600} message={authError} action={
                        <Button color="inherit" size="small" onClick={() => setOpen(false)}>
                            X
                        </Button>
                    }
                />
            </Box>
        </Container>
    )
}

export default withFirebase(SignUpPage);