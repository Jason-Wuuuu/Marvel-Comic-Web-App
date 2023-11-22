import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { useQuery } from "@apollo/client";
import { GET_COMIC } from "../queries";

import { removeComic } from "../reducers/collectionReducer";

import {
  Card,
  CardActionArea,
  CardHeader,
  CardMedia,
  CardContent,
  Button,
  Grid,
} from "@mui/material";

import noImage from "../img/image_not_available.jpg";

function CollectionComicCard({ comicId, collectionName }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [title, setTitle] = useState("N/A");
  const [thumbnail, setThumbnail] = useState(noImage);

  const { loading, error, data } = useQuery(GET_COMIC, {
    variables: { comicId },
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    if (!loading) {
      if (data.getComicById.title) setTitle(data.getComicById.title);
      if (data.getComicById.thumbnail)
        setThumbnail(data.getComicById.thumbnail);
    }
  }, [loading]);

  return (
    <Grid item key={comicId}>
      <Card
        sx={{ width: 250, height: "100%" }}
        style={{
          backgroundColor: "#242424",
        }}
      >
        <CardActionArea
          onClick={() => {
            navigate(`/marvel-comics/${comicId}`);
          }}
        >
          <CardHeader
            title={title}
            sx={{
              height: 50,
            }}
            titleTypographyProps={{
              fontSize: 12,
              fontFamily: "monospace",
              fontWeight: "bolder",
              color: "snow",
            }}
          ></CardHeader>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <CardMedia
              component="img"
              image={thumbnail}
              title="thumbnail"
              sx={{
                width: "auto",
                height: 300,
              }}
            />
          </div>
        </CardActionArea>

        <CardContent
          style={{
            display: "flex",
            justifyContent: "center",
          }}
          sx={{
            height: 30,
          }}
        >
          <Button
            variant={"outlined"}
            style={{
              borderRadius: 100,
              fontFamily: "monospace",
              fontWeight: "bold",
              borderColor: "snow",
              color: "snow",
            }}
            color="inherit"
            onClick={() => {
              dispatch(
                removeComic({ collection: collectionName, comicId: comicId })
              );
            }}
          >
            Give Up
          </Button>
        </CardContent>
      </Card>
    </Grid>
  );
}

export default CollectionComicCard;
