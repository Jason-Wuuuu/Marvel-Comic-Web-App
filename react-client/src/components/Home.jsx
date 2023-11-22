import React from "react";
import { useNavigate } from "react-router-dom";

import { Grid, Button, Box, Typography } from "@mui/material";

import logo from "../img/Marvel_Logo.svg";

function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <Grid
        container
        direction={"column"}
        spacing={10}
        marginTop={1}
        justifyContent="center"
      >
        <Grid item>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Box
              component="img"
              title="logo"
              sx={{
                width: "auto",
                height: 350,
              }}
              src={logo}
            />
          </div>
        </Grid>
        <Grid item>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
            style={{
              fontFamily: "monospace",
              fontWeight: "bolder",
              color: "#424242",
            }}
            align="center"
          >
            Welcome to the Marvel Comic Web APP.
          </Typography>
        </Grid>
      </Grid>

      <Grid container marginTop={3} justifyContent="center">
        <Button
          variant="contained"
          style={{
            borderRadius: 100,
            fontFamily: "monospace",
            fontWeight: "bold",
            backgroundColor: "#424242",
          }}
          color="inherit"
          onClick={() => {
            navigate("/marvel-comics/page/1");
          }}
        >
          Let's Go
        </Button>
      </Grid>
    </div>
  );
}

export default Home;
