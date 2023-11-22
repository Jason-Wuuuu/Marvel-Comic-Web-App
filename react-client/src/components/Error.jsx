import React from "react";

import { useNavigate } from "react-router-dom";

import { Grid, Button, Typography, Link } from "@mui/material";

export const Error = ({ errorCode, errorMessage }) => {
  const navigate = useNavigate();

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Grid
          container
          direction="row"
          marginTop={12}
          style={{
            maxWidth: "70vw",
          }}
        >
          <Grid item>
            <Typography
              variant="h4"
              sx={{
                fontFamily: "monospace",
                fontWeight: "bolder",
                color: "#424242",
              }}
            >
              {errorCode}
            </Typography>

            <Typography
              variant="h5"
              sx={{
                fontFamily: "monospace",
                fontWeight: "bolder",
                color: "#424242",
              }}
              marginTop={5}
            >
              {errorMessage}
            </Typography>
          </Grid>
        </Grid>
      </div>

      <Grid container marginTop={5} justifyContent="center">
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
            location.reload();
          }}
        >
          Back to Comics
        </Button>
      </Grid>
    </div>
  );
};
