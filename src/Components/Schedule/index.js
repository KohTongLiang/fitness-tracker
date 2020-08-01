import React, { useState, useEffect } from 'react';
import {  withAuthorization } from '../Session';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { useForm, Controller } from 'react-hook-form';
import moment from 'moment';

import { Container, Fab, Slide, Typography, Dialog,
    DialogContent, AppBar, Toolbar, IconButton,
    FormHelperText, FormGroup, Button, Select, MenuItem,
    TextField, } from '@material-ui/core';
import { Add as AddIcon, Close as CloseIcon, Save as SaveIcon  } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';

import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);
const style = theme => ({
    fab: {
        margin: 0,
        top: 'auto',
        left: 'auto',
        bottom: 20,
        right: 20,
        position: 'fixed',
    },
    appBar: {
        position: 'relative',
    },
    dialogTitle: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    errorText: {
        color: 'red'
    },
    form: {
      padding: 20
    },
});

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function Schedule (props) {
    const { classes } = props;
    const historyRef = props.firebase.getFirestore().collection('users').doc(props.uid).collection('history');
    const workoutRef = props.firebase.getFirestore().collection('users').doc(props.uid).collection('workouts');
    const [scheduleList, setScheduleList] = useState([]);
    const [addScheduleScreen, setAddScheduleScreen] = useState(false);
    const [workoutList, setWorkoutList] = useState([]);
    const {handleSubmit, control, errors, getValues, setValue } = useForm();

    useEffect(() => {
        if (addScheduleScreen) {
            const unsubscribe = workoutRef.onSnapshot(snapshot => {
                const arr = [];
                snapshot.forEach (e => {
                    arr.push({
                        workoutId: e.id,
                        workoutName: e.data().workoutName
                    })
                });
                setWorkoutList(arr);
            });
            return unsubscribe;
        }
    }, [addScheduleScreen])

    const handleAddSchedule = () => {
        setAddScheduleScreen(true);
    }

    const onSubmit = e => {
        console.log(e);
    }

    const formValues = getValues();

    return(
            <div>
            <Container>
                <Calendar 
                    localizer={localizer}
                    events={scheduleList}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500 }}
                />
            </Container>
            <Dialog open={addScheduleScreen} fullScreen TransitionComponent={Transition}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={() => setAddScheduleScreen(false)} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.dialogTitle}>
                            Schedule Workout
                        </Typography>
                        <IconButton color="inherit" onClick={() => console.log('poop')}>
                        <SaveIcon />
                    </IconButton>
                    </Toolbar>
                </AppBar>
                <DialogContent>
                    <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
                        <FormGroup>
                            <Controller
                                control={control}
                                name='workout'
                                rules={{ required: true }}
                                render={({ onChange, value }) => (
                                    <Select
                                        value={formValues.workout}
                                        defaultValue={formValues.workout || 0}
                                        onChange={e => setValue('workout', e.target.value)}
                                    >
                                        <MenuItem value={0}>Select Workout</MenuItem>
                                        {workoutList && workoutList.map(e => (
                                            <MenuItem key={e.workoutId} value={e.workoutId}>{e.workoutName}</MenuItem>
                                        ))}
                                    </Select>
                            )} />
                            <FormHelperText>Select the workout you wish to conduct at scheduled time.</FormHelperText>
                            <FormHelperText>{errors.workout && <span className={classes.errorText}>Please select a workout</span>}</FormHelperText>
                        </FormGroup>
                        <FormGroup>
                            <Controller 
                                control={control}
                                name="startDate"
                                rules={{ require: true }}
                                render={({ onChange, value }) => (
                                    <TextField
                                        label="Start Date & Time"
                                        type="datetime-local"
                                        defaultValue={formValues.startDate || new Date()}
                                        value={formValues.startDate}
                                        onChange={e => setValue('startDate', e.target.value)}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                )}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Controller
                                control={control}
                                name='repeat'
                                rules={{ required: true }}
                                render={({ onChange, value }) => (
                                    <Select
                                        value={formValues.repeat}
                                        defaultValue={formValues.repeat || 0}
                                        onChange={e => setValue('repeat', e.target.value)}
                                    >
                                        <MenuItem value={0}>Never</MenuItem>
                                        <MenuItem value={1}>Daily</MenuItem>
                                        <MenuItem value={2}>Weekly</MenuItem>
                                        <MenuItem value={3}>Monthly</MenuItem>
                                    </Select>
                            )} />
                            <FormHelperText>Choose whether you want to repeat the schedule</FormHelperText>
                            <FormHelperText>{errors.repeat && <span className={classes.errorText}></span>}</FormHelperText>
                        </FormGroup>
                        <FormGroup>
                            <Button type="submit" color="inherit">Save</Button>
                        </FormGroup>
                    </form>
                </DialogContent>
            </Dialog>
            <Fab color="primary" onClick={() => handleAddSchedule()} className={classes.fab} aria-label="add">
                <AddIcon />
            </Fab>
        </div>
    )
}

const condition = authUser => !!authUser;
export default withAuthorization(condition)(withStyles(style)(Schedule));