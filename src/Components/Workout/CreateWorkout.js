import React, { useState } from 'react';
import { Button, Slide, Paper,
   FormControl, FormHelperText, Input, InputLabel,FormGroup  } from '@material-ui/core';

function CreateWorkout (props) {
  const [state, setState] = useState({});

  const onChange = event => {
    setState({
      ...state,
      [event.target.name]: event.target.value
    });
  }

  const { workoutName, noOfCycles, noOfSets, warmup, cooldown, work, rest, restBetweenSets } = state;
  const { classes } = props;

  return (
    <Slide direction="up" in={props.createFormShow} className={classes.slide} mountOnEnter unmountOnExit>
        <Paper elevation={4} className={classes.paper}>
            <form className={classes.form}>
              <FormGroup>
                  <FormControl>
                  <InputLabel>Workout Name</InputLabel>
                  <Input name="workoutName" onChange={onChange} value={workoutName}/>
                  <FormHelperText>Name for your workout</FormHelperText>
                  </FormControl>
              </FormGroup>
              <FormGroup>
                  <FormControl>
                  <InputLabel>Number of Cycles</InputLabel>
                  <Input name="noOfCycles" onChange={onChange} value={noOfCycles}/>
                  </FormControl>
              </FormGroup>
              <FormGroup>
                  <FormControl>
                  <InputLabel>Number of Sets</InputLabel>
                  <Input name="noOfSets" onChange={onChange} value={noOfSets}/>
                  </FormControl>
              </FormGroup>
              <FormGroup>
                  <FormControl>
                  <InputLabel>Warmup</InputLabel>
                  <Input name="warmup" onChange={onChange} value={warmup}/>
                  </FormControl>
              </FormGroup>
              <FormGroup>
                  <FormControl>
                  <InputLabel>Work</InputLabel>
                  <Input name="work" onChange={onChange} value={work}/>
                  </FormControl>
              </FormGroup>
              <FormGroup>
                  <FormControl>
                  <InputLabel>Rest</InputLabel>
                  <Input name="rest" onChange={onChange} value={rest}/>
                  </FormControl>
              </FormGroup>
              <FormGroup>
                  <FormControl>
                  <InputLabel>Rest Between Sets</InputLabel>
                  <Input name="restBetweenSets" onChange={onChange} value={restBetweenSets}/>
                  </FormControl>
              </FormGroup>
              <FormGroup>
                  <FormControl>
                  <InputLabel>Cooldown</InputLabel>
                  <Input name="cooldown" onChange={onChange} value={cooldown}/>
                  </FormControl>
              </FormGroup>
              <FormGroup>
                  <Button onClick={() => props.submitWorkout(state)}>Submit</Button>
                  <Button onClick={props.closeForm}>Close</Button>
              </FormGroup>
            </form>
        </Paper>
    </Slide>
  );
}

export default CreateWorkout;
