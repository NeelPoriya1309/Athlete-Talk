import {
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
const { server } = require('./../../../utils/server');

const BrowsePlans = ({ plans }) => {
  const router = useRouter();
  return (
    <>
      <Grid container spacing={2}>
        {plans.map((plan, idx) => {
          return (
            <Grid xs={4} key={idx} item>
              <Card sx={{ minWidth: 275 }}>
                <CardContent>
                  <Typography color="text.primary" variant="h5" gutterBottom>
                    {plan.name.slice(0, 30) +
                      (plan.name.length > 30 ? '...' : '')}
                  </Typography>
                  <Typography
                    color="text.primary"
                    variant="p"
                    sx={{ display: 'block' }}
                  >
                    {plan.description.slice(0, 45) +
                      (plan.description.length > 45 ? '...' : '')}
                  </Typography>
                  <Typography color="text.primary" variant="body1">
                    <b>Created By</b>: {plan.creator.name}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button id={plan._id} 
                    variant="contained"
                    onClick={(e) => {
                      e.preventDefault();
                      router.push(`/plans/browse/${plan._id}`);
                    }}
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};

export async function getServerSideProps(context) {
  const { req, res } = context;
  if (!req.cookies.jwt) {
    console.log('Cookie not found🍪🍪');
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  try {
    const plans = await fetch(`${server}/api/plans`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${req.cookies.jwt}`,
      },
    });

    if (plans.ok) {
      const data = await plans.json();

      return {
        props: {
          plans: data.data.plans,
        },
      };
    } else {
      console.log(plans);
      throw new Error('Something went wrong', plans);
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
    props: {}, // will be passed to the page component as props
  };
}

export default BrowsePlans;
