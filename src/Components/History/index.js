import React, { useState, useEffect, forwardRef  } from 'react';
import moment from 'moment';
import {  withAuthorization } from '../Session';
import { Container, } from '@material-ui/core';
import MaterialTable from 'material-table';
import { withStyles } from '@material-ui/core/styles';

import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const style = theme => ({
    poop: {
    }
});

function History (props) {
    const historyRef = props.firebase.getFirestore().collection('users').doc(props.uid).collection('history');
    const workoutRef = props.firebase.getFirestore().collection('users').doc(props.uid).collection('workouts');
    const [workoutHistory, setWorkoutHistory] = useState([]);
    const classes = { props }
    const [tableState, setTaleState] = useState({});

    useEffect(() => {
        const unsubscribe = historyRef.onSnapshot(snapshot => {
          snapshot.forEach (e => {
            const endDateTime = moment(e.data().doneOn).add(e.data().totalWork, 'seconds');

            setWorkoutHistory(workoutHistory => [...workoutHistory, {
                title: 'Workout',
                start: e.data().doneOn.toString(),
                end: moment(endDateTime).format('YYYY-MM-DD HH:mm:ss').toString(),
            }]);
          });
        });
        return unsubscribe;
    }, []);

    return (
        <div>
            <Container>
                <MaterialTable
                    title="History"
                    icons={tableIcons}
                    columns={[
                        { title: 'Title', field: 'title'},
                        { title: 'Start', field: 'start'},
                        { title: 'End', field: 'end'}
                    ]}
                    data={workoutHistory}
                />
            </Container>
        </div>
    )
}

const condition = authUser => !!authUser;
export default withAuthorization(condition)(withStyles(style)(History));