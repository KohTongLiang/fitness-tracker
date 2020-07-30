import React, { useState, useEffect } from 'react';
import moment from 'moment';
import momentDuration from 'moment-duration-format';
import CreateWorkoutForm from './CreateWorkout';

import {  withAuthorization } from '../Session';
import { Container, IconButton, Fab, Card, CardContent,
  Slide, Typography, Dialog,
  DialogContent, LinearProgress, AppBar, Toolbar, Grid } from '@material-ui/core';
import { Add as AddIcon, PlayArrow as PlayArrowIcon, Delete as DeleteIcon,
Edit as EditIcon, Close as CloseIcon } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';

const style = theme => ({
  workoutScreen: {
    display: 'flex',
    alignItems: 'center',
  },
  fab: {
    margin: 0,
    top: 'auto',
    left: 'auto',
    bottom: 20,
    right: 20,
    position: 'fixed',
  },
  slide: {
    zIndex: 1,
    position: 'fixed',
    width: '80%',
    right: '10%',
    left: 'auto',
  },
  appBar: {
    position: 'relative',
  },
  dialogTitle: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  form: {
    padding: 20
  },
  root: {
    display: 'flex',
    margin: 5
  },
  content: {
    flex: '1 0 auto',
  },
  controls: {
    alignItems: 'right',
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  playIcon: {
    height: 38,
    width: 38,
  },
  details: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
  },
  centerText: {
    textAlign: 'center'
  },
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Workout (props) {
  const [createFormShow, setCreateFormShow] = useState(false);
  const [workoutList, setWorkoutList] = useState([]);
  const [error, setError] = useState('')
  const [intervalTime, setIntervalTime] = useState([]);
  const [intervalRemaining, setIntervalRemaining] = useState(0);
  const [totalWork, setTotalWork] = useState(0);
  const [totalRemaining, setTotalRemaining] = useState(0);
  const [intervalTitle, setIntervalTitle] = useState([]);
  const [workout, setWorkout] = useState({});
  const [intervalStage, setIntervalStage] = useState(0);
  const [workoutScreen, setWorkoutScreen] = useState(false);
  const dbRef = props.firebase.getFirestore().collection('users').doc(props.uid).collection('workouts');
  const history = props.firebase.getFirestore().collection('users').doc(props.uid).collection('history');
  const { classes } = props;

  useEffect(() => {
    const unsubscribe = dbRef.onSnapshot(snapshot => {
      const workouts = [];
      snapshot.forEach (e => {
        workouts.push({
          id: e.id,
          data: e.data(),
          });
      });
      
      setWorkoutList(workouts);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (workoutScreen) {
      if (isNaN(intervalTime[intervalStage])) {
        history.add({
          doneOn: moment().format("YYYY-MM-DD HH:mm:ss"),
          workoutId: workout,
          totalWork: totalWork,
        });

        setWorkoutScreen(false);
        setIntervalStage(0);
        setTotalRemaining(0);
        setIntervalRemaining(0);
        setTotalWork(0);
        setWorkout({});
      } else {
        setIntervalRemaining(intervalTime[intervalStage]);
      }
    }
  }, [workoutScreen, intervalStage]);

  useEffect(() => {
    let interval = null;

    if (workoutScreen) {
      interval = intervalRemaining > 0 && setInterval(() => {
        setIntervalRemaining(intervalRemaining => intervalRemaining - 1);
        setTotalRemaining(totalRemaining => totalRemaining - 1);
      }, 1000);

      if (intervalRemaining > 0 && intervalRemaining <= 3) {
        window.navigator.vibrate(500);
      } else if (intervalRemaining <= 0) {
        window.navigator.vibrate(1000);

        setIntervalStage(intervalStage => intervalStage + 1);
      }
      return () => clearInterval(interval);
    } else {
      clearInterval(interval);
      setIntervalStage(0);
      setTotalRemaining(0);
      setIntervalRemaining(0);
      setTotalWork(0);
    }
    return () => clearInterval(interval);
  }, [intervalRemaining]);

  const startWorkout = workout => {
    const workoutObject = workout.data;
    setIntervalTime([]);
    setIntervalTitle([]);
    setWorkout(workout.id);
    setIntervalTitle(intervalTitle => [...intervalTitle, 'Warmup'])
    setIntervalTime(intervalTime => [ ...intervalTime, workoutObject.warmup]);
    setTotalRemaining(totalRemaining => totalRemaining + parseInt(workoutObject.warmup));

    for (var i = 0; i < workoutObject.noOfSets; i++) {
      for (var j = 0; j < workoutObject.noOfCycles; j++) {
        setIntervalTitle(intervalTitle => [...intervalTitle, 'Work'])
        setIntervalTime(intervalTime => [...intervalTime, workoutObject.work]);
        setTotalRemaining(totalRemaining => totalRemaining + parseInt(workoutObject.work));
        setTotalWork(totalWork => totalWork + parseInt(workoutObject.work));

        if (workoutObject.noOfCycles - j > 1) {
          setIntervalTitle(intervalTitle => [...intervalTitle, 'Rest'])
          setIntervalTime(intervalTime => [...intervalTime, workoutObject.rest]);
          setTotalRemaining(totalRemaining => totalRemaining + parseInt(workoutObject.rest));
        }
      }

      if (workoutObject.noOfSets - i > 1) {
        setIntervalTitle(intervalTitle => [...intervalTitle, 'Rest Between Sets'])
        setIntervalTime(intervalTime => [...intervalTime, workoutObject.restBetweenSets]);
        setTotalRemaining(totalRemaining => totalRemaining + parseInt(workoutObject.restBetweenSets));
      }
    }

    setIntervalTitle(intervalTitle => [...intervalTitle, 'Cooldown'])
    setIntervalTime(intervalTime => [...intervalTime, workoutObject.cooldown]);
    setTotalRemaining(totalRemaining => totalRemaining + parseInt(workoutObject.cooldown));
    setWorkoutScreen(true);
  }

  const showCreatePage = toggle => {
    setCreateFormShow(toggle);
  };

  const submitWorkout = workoutObject => {
    dbRef.add(workoutObject);
    setCreateFormShow(false);
  }

  const deleteWorkout = workoutId => {
    dbRef.doc(workoutId).delete();
  }

  return (
  <div>
    <Container>
      {error && <p>{error}</p>}
      {workoutList &&  workoutList.map(workout => (
        <Card key={workout.id} className={classes.root}>
          <div className={classes.details}>
            <CardContent className={classes.content}>
              <Typography component="h5" variant="h5">
                {workout.data.workoutName}
              </Typography>
            </CardContent>
          </div>
          <div className={classes.controls}>
            <IconButton onClick={() => startWorkout(workout)} aria-label="play/pause">
              <PlayArrowIcon className={classes.playIcon} />
            </IconButton>
            <IconButton onClick={() => deleteWorkout(workout.id)}>
              <DeleteIcon />
            </IconButton>
          </div>
        </Card>
      ))}
      <Dialog open={workoutScreen} fullScreen TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
              <Toolbar>
                  <IconButton edge="start" color="inherit" onClick={() => setWorkoutScreen(false)} aria-label="close">
                      <CloseIcon />
                  </IconButton>
                  <Typography variant="h6" className={classes.dialogTitle}>
                      Workout
                  </Typography>
              </Toolbar>
        </AppBar>
        <DialogContent className={classes.workoutScreen}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography component="h3" variant="h3" className={classes.centerText}>
                {moment.duration(totalRemaining, 'seconds').format("hh:mm:ss")}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography component="h3" variant="h3" className={classes.centerText}>
                {intervalTitle[intervalStage]} {intervalRemaining}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <LinearProgress  variant="determinate" value={(intervalRemaining / intervalTime[intervalStage]) * 100} />
            </Grid>
            <Grid item xs={12}>
              <Typography component="h4" variant="h4" className={classes.centerText}>
                Next: {intervalTitle[intervalStage+1] && <span>{intervalTitle[intervalStage+1]} {intervalTime[intervalStage+1]}</span>}
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </Container>
    <Fab color="primary" onClick={() => showCreatePage(!createFormShow)} className={classes.fab} aria-label="add">
        <AddIcon />
    </Fab>
    <CreateWorkoutForm {...props} createFormShow={createFormShow} submitWorkout={submitWorkout}
      closeForm={() => showCreatePage(false)}/>
  </div>
  );
}

const condition = authUser => !!authUser;
export default withAuthorization(condition)(withStyles(style)(Workout));