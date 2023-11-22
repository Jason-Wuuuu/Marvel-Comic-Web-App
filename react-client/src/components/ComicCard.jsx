import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { addComic, removeComic } from "../reducers/collectionReducer";

import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Grid,
  Button,
  CardActionArea,
} from "@mui/material";

import noImage from "../img/image_not_available.jpg";

function ComicCard({ comicData }) {
  // navigation
  const navigate = useNavigate();

  // redux
  const dispatch = useDispatch();
  const allCollections = useSelector((state) => state.collections);
  const [selectedCollection, setSelectedCollection] = useState("");

  // comic data
  const [id, setId] = useState(undefined);
  const [title, setTitle] = useState("Loading...");
  const [thumbnail, setThumbnail] = useState(noImage);

  useEffect(() => {
    if (comicData) {
      if (comicData.id) setId(comicData.id);
      if (comicData.title) setTitle(comicData.title);

      if (comicData.thumbnail) setThumbnail(comicData.thumbnail);
    }
  }, [comicData]);

  useEffect(() => {
    if (allCollections) {
      setSelectedCollection(allCollections.selected);
    }
  }, [allCollections]);

  return (
    <Grid item>
      <Card
        sx={{ width: 300, height: "100%" }}
        style={{
          backgroundColor: "#242424",
        }}
      >
        <CardActionArea
          onClick={() => {
            navigate(`/marvel-comics/${id}`);
          }}
          disabled={!id}
        >
          <CardHeader
            title={title}
            sx={{
              height: 50,
            }}
            titleTypographyProps={{
              fontSize: 14,
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
                height: 350,
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
          {title !== "Loading..." ? (
            <Button
              variant={"outlined"}
              style={
                selectedCollection !== ""
                  ? allCollections.collections[selectedCollection].includes(id)
                    ? // collected
                      {
                        borderRadius: 100,
                        fontFamily: "monospace",
                        fontWeight: "bold",
                        borderColor: "snow",
                        color: "snow",
                      }
                    : // not collected
                      {
                        borderRadius: 100,
                        fontFamily: "monospace",
                        fontWeight: "bold",
                        backgroundColor: "snow",
                        borderColor: "snow",
                      }
                  : // no collection
                    {
                      borderRadius: 100,
                      fontFamily: "monospace",
                      fontWeight: "bold",
                      backgroundColor: "#424242",
                      color: "lightgray",
                    }
              }
              color="inherit"
              disabled={selectedCollection === ""}
              onClick={() => {
                if (
                  allCollections.collections[selectedCollection].includes(id)
                ) {
                  dispatch(
                    removeComic({ collection: selectedCollection, comicId: id })
                  );
                } else {
                  if (
                    allCollections.collections[selectedCollection].length < 20
                  ) {
                    dispatch(
                      addComic({ collection: selectedCollection, comicId: id })
                    );
                  } else {
                    alert("Collection can only have at most 20 comics.");
                  }
                }
              }}
            >
              {selectedCollection !== ""
                ? allCollections.collections[selectedCollection].includes(id)
                  ? "Give Up"
                  : "Collect"
                : "No Collection Selected"}
            </Button>
          ) : (
            <Button
              variant={"outlined"}
              style={{
                borderRadius: 100,
                fontFamily: "monospace",
                fontWeight: "bold",
                backgroundColor: "#424242",
                color: "lightgray",
              }}
              color="inherit"
              disabled
            >
              Loading
            </Button>
          )}
        </CardContent>
      </Card>
    </Grid>
  );
}

export default ComicCard;
