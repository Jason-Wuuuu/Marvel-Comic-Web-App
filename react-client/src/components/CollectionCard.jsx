import React, { useState, useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import { deleteCollection } from "../reducers/collectionReducer";

import { Grid, Typography, Button } from "@mui/material";

import CollectionComicCard from "./CollectionComicCard";

function CollectionCard({ collectionData }) {
  // redux
  const dispatch = useDispatch();
  const allCollections = useSelector((state) => state.collections);
  const [selectedCollection, setSelectedCollection] = useState("");

  const [name, setName] = useState("");
  const [comics, setComics] = useState([]);

  useEffect(() => {
    if (collectionData) {
      if (collectionData.name) setName(collectionData.name);
      if (collectionData.comics) setComics(collectionData.comics);
    }
  }, [collectionData]);

  useEffect(() => {
    if (allCollections) {
      setSelectedCollection(allCollections.selected);
    }
  }, [allCollections]);

  const handleDelete = (event) => {
    event.preventDefault();
    if (name !== "") {
      if (selectedCollection === name) {
        alert(`You cannot delete the currently selected collection.`);
      } else {
        dispatch(deleteCollection({ collection: name }));
      }
    }
  };

  if (collectionData) {
    return (
      <Grid item>
        <Grid container direction={"column"} marginTop={3}>
          <Typography
            variant="h4"
            style={{
              fontFamily: "monospace",
              fontWeight: "bolder",
              color: "#424242",
            }}
            align="center"
          >
            {name} ({comics.length}/20):
            <Button
              variant="contained"
              style={{
                borderRadius: 100,
                fontFamily: "monospace",
                fontWeight: "bold",
                color: "#424242",
                marginLeft: 20,
              }}
              color="inherit"
              onClick={handleDelete}
              // disabled={selectedCollection === name}
            >
              Delete
            </Button>
          </Typography>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <Grid
              container
              spacing={2}
              style={{
                overflowX: "auto",
                flexWrap: "nowrap",
                padding: "16px",
                maxWidth: "70vw",
              }}
            >
              {comics &&
                comics.map((comicId) => {
                  return (
                    <CollectionComicCard
                      comicId={comicId}
                      collectionName={name}
                      key={comicId}
                    />
                  );
                })}
            </Grid>
          </div>
        </Grid>
      </Grid>
    );
  }
}

export default CollectionCard;
