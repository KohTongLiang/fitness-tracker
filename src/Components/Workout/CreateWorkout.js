import React, { useState } from 'react';
import { Slide, FormControl, AppBar, Toolbar, FormHelperText, 
   Dialog,  Input, InputLabel,FormGroup, IconButton, Typography  } from '@material-ui/core';
import { Close as CloseIcon, Save as SaveIcon} from '@material-ui/icons';


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

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

  const handleSubmit = () => {
      props.submitWorkout(state);
      setState({});
  }

  return (
    <div>
        <Dialog fullScreen open={props.createFormShow} onClose={props.closeForm} TransitionComponent={Transition}>
            <AppBar className={classes.appBar}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={props.closeForm} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.dialogTitle}>
                        Add Workout
                    </Typography>
                    <IconButton color="inherit" onClick={() => handleSubmit()}>
                        <SaveIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
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
            </form>
        </Dialog>
    </div>
  );
}

export default CreateWorkout;
