import React, { useContext, useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
import AuthContext from '../../store/auth-context';

const BasicRadialChart = dynamic(
  () => import('../../components/BasicRadialChart'),
  { ssr: false }
);

const colors = [
  '#FF6633',
  '#FFB399',
  '#FF33FF',
  '#FFFF99',
  '#00B3E6',
  '#E6B333',
  '#3366E6',
  '#999966',
  '#99FF99',
  '#B34D4D',
  '#80B300',
  '#809900',
  '#E6B3B3',
  '#6680B3',
  '#66991A',
  '#FF99E6',
  '#CCFF1A',
  '#FF1A66',
  '#E6331A',
  '#33FFCC',
  '#66994D',
  '#B366CC',
];

const Dashboard = ({ plans, categories }) => {
  console.log(categories);
  const authContext = useContext(AuthContext);
  const completedPlans = plans.filter(
    (plan) => plan.progress === plan.plan.noOfDays
  );

  const inProgressPlans = plans.filter(
    (plan) => plan.progress !== plan.plan.noOfDays
  );

  return (
    <>
      <Typography variant="h4">Welcome, {authContext.user.name}</Typography>
      <br></br>
      <Paper elevation={2}>
        <Typography variant="h5" p={2}>
          Plan Summary
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <BasicRadialChart
              completed={completedPlans.length}
              total={plans.length}
            />
          </Grid>
          <Grid item xs={12} md={4} p={2}>
            <Typography variant="h5">In Progress</Typography>
            {inProgressPlans.map((plan) => (
              <Box
                key={plan._id}
                sx={{ display: 'flex', justifyContent: 'space-between' }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 'bold',
                  }}
                >
                  {plan.plan.name}
                </Typography>
                <Typography variant="body1">
                  {plan.progress}/{plan.plan.noOfDays}
                </Typography>
              </Box>
            ))}
          </Grid>
          <Grid item xs={12} md={4} p={2}>
            <Typography variant="h5">Completed</Typography>
            {completedPlans.map((plan) => (
              <Box
                key={plan._id}
                sx={{ display: 'flex', justifyContent: 'space-between' }}
              >
                <Typography sx={{ fontWeight: 'bold' }} variant="h6">
                  {plan.plan.name}
                </Typography>
                <Typography variant="body1">
                  {plan.progress}/{plan.plan.noOfDays}
                </Typography>
              </Box>
            ))}
          </Grid>
        </Grid>
      </Paper>
      <br></br>
      <Paper elevation={2}>
        <Typography variant="h5" p={2}>
          Preferred Category
        </Typography>
        <Box
          sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}
          m={2}
          pb={2}
        >
          {categories[0].preferredCategories.map((category, idx) => (
            <Box
              key={category._id}
              sx={{
                display: 'grid',
              }}
              m={1}
            >
              <Typography
                variant="h6"
                p={2}
                sx={{
                  display: 'inline-grid',
                  fontWeight: 'bold',
                  height: '125px',
                  width: '275px',
                  bgcolor: colors[idx % colors.length],
                  fontSize: '25px',
                  borderRadius: '10px',
                }}
              >
                {category.name}
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>
    </>
  );
};

export async function getServerSideProps(context) {
  const { req, res } = context;

  if (!req.cookies.jwt) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${req.cookies.jwt}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return {
        props: {
          plans: data.data.userPlans,
          categories: data.data.userCategories,
        },
      };
    } else {
      throw new Error('Not authenticated!', response);
    }
  } catch (err) {
    console.log(err);
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

export default Dashboard;
