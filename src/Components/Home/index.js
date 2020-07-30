import React from 'react';
import { Box, Container } from '@material-ui/core';
function Home() {
    return (
        <Box>
            <Container>
                <h4>Basic Workout App</h4>
                <p>Current Features</p>
                <ul>
                    <li>User Accounts</li>
                    <li>Create/Start workouts</li>
                    <li>Workout History (wip)</li>
                    <li>Workout Scheduling with reminder (wip)</li>
                </ul>
            </Container>
        </Box>
    )
}

export default Home;