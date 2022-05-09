import React from 'react'
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Grid';

function Loading() {
  return (
    <div >
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        //style={{ minHeight: "100vh", marginTop: "" }}
      >
      <Card sx={{ maxWidth: 545, m: 2 }}>
      <CardHeader
        avatar={
            <Skeleton animation="wave" variant="circular" width={40} height={40} />
         
        }
       
      />
      { 
        <Skeleton sx={{ height: 240 ,width:600}} animation="wave" variant="rectangular" />
       }

      <CardContent>
        {
          <React.Fragment>
            <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
            <Skeleton animation="wave" height={10} width="80%" />
          </React.Fragment>
        }
      </CardContent>
    </Card>
    </Grid>
</div>
  )
}

export default Loading