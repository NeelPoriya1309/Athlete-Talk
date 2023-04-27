import { Box, Button, Paper, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import server from '../../../../server';

const ContinuePlan = ({ videos, day }) => {
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(0);
  const [currentVideo, setCurrentVideo] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [score, setScore] = useState(0);

  const handleStart = (e) => {
    e.preventDefault();
    if (currentPage === 0) {
      setCurrentPage(1);
      setStartTime((prev) => {
        if (prev === null) return Date.now();
        return prev;
      });
    }

    if (currentPage === 1) {
      if (currentVideo < videos.length - 1) {
        setCurrentVideo((prev) => prev + 1);
      } else {
        setCurrentPage(2);
      }
    }
  };

  const handleBack = (e) => {
    e.preventDefault();
    if (currentPage === 0) {
      router.back();
    }

    if (currentPage === 1) {
      if (currentVideo === 0) {
        setCurrentPage(0);
      } else {
        setCurrentVideo((prev) => prev - 1);
      }
    }

    if (currentPage === 2) {
      setCurrentPage(1);
    }
  };

  const handleFinish = async (e) => {
    e.preventDefault();
    const endTime = Date.now();

    const timeTaken = endTime - startTime;

    const body = {
      day,
      planID: router.query.id,
      timeTaken,
    };

    try {
      const updatePlanDay = await fetch(`/api/plans/myplan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(body),
      });

      if (updatePlanDay.ok) {
        const data = await updatePlanDay.json();
        const score = data.data.score;
        setScore(score);
        setCurrentPage(2);
      }
    } catch (err) {
      console.log(err);
      router.push('/plans/myplan');
    }
  };

  const concentPage = (
    <Paper elevation={2}>
      <Box>
        <Typography variant="h4">
          Welcome to Day {day + 1} of your plan...
        </Typography>
        <Typography variant="h5">
          You have {videos.length} videos to watch today:
        </Typography>
        <ul>
          {videos.map((video) => (
            <li key={video._id}>{video.title}</li>
          ))}
        </ul>
        <Button onClick={handleBack}>Back</Button>
        <Button variant="contained" onClick={handleStart}>
          Start
        </Button>
      </Box>
    </Paper>
  );
  const videoPage = (
    <>
      <Typography variant="h5">Exercise # {currentVideo + 1}</Typography>
      <Typography variant="h6">{videos[currentVideo].title}</Typography>
      <Box>
        <iframe
          src={`https://drive.google.com/file/d/${videos[currentVideo].gDriveID}/preview`}
          width="640"
          height="480"
          allowFullScreen
          allow="autoplay"
          frameborder="0"
        ></iframe>
      </Box>
      <Button onClick={handleBack}>Back</Button>
      {currentVideo === videos.length - 1 && (
        <Button variant="contained" onClick={handleFinish}>
          Finish
        </Button>
      )}
      {currentVideo !== videos.length - 1 && (
        <Button variant="contained" onClick={handleStart}>
          Next
        </Button>
      )}
    </>
  );
  const finishPage = (
    <>
      <Typography variant="h5">
        Congratulations! You have completed today`s task.
      </Typography>
      <Typography variant="h6">Your score is: {score + ''}</Typography>
      <Button
        variant="contained"
        onClick={(e) => {
          e.preventDefault();
          router.push('/plans/myplan');
        }}
      >
        Go to plans
      </Button>
    </>
  );
  const pages = [concentPage, videoPage, finishPage];
  return <>{pages[currentPage]}</>;
};

export async function getServerSideProps(context) {
  const { req, res } = context;
  const { id } = context.query;

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
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user-plans/${id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${req.cookies.jwt}`,
        },
      }
    );

    if (response.ok) {
      const plan = await response.json();

      return {
        props: {
          videos: plan.data.videos,
          day: plan.data.day,
        },
      };
    } else {
      throw new Error('Something went wrong!');
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

export default ContinuePlan;
