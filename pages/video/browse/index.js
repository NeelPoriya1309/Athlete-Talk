import React, { useEffect } from 'react';
const { server } = require('./../../../utils/server');
import VideoCard from '../../../components/VideoCard';
import { Box, Grid } from '@mui/material';

const BrowseVideos = ({ videos }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
      }}
    >
      {videos &&
        videos.length !== 0 &&
        videos.map((video, idx) => (
          <Box
            key={idx}
            sx={{
              m: 1,
              width: 350,
              height: 450,
            }}
          >
            <VideoCard details={video} />
          </Box>
        ))}
    </Box>
  );
};

export async function getServerSideProps(context) {
  const { req, res } = context;

  //Checking if there is a cookie of jwt token
  if (!req.cookies.jwt)
    return { redirect: { destination: '/login', permanent: false } };

  try {
    const response = await fetch(`${server}/api/videos`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${req.cookies.jwt}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      return { props: { videos: data.data.videos } };
    } else {
      throw new Error('something went wrong!');
    }
  } catch (err) {
    console.log(err);
    return { redirect: { destination: '/login', permanent: false } };
  }
  return { redirect: { destination: '/login', permanent: false } };
}

export default BrowseVideos;
