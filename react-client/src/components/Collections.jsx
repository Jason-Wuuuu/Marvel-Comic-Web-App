import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { addCollection, setSelected } from "../reducers/collectionReducer";
import { persistor } from "../store";

import CollectionCard from "./CollectionCard";

import {
  Grid,
  Button,
  Typography,
  AppBar,
  Toolbar,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

function Collections() {
  const navigate = useNavigate();

  // redux
  const dispatch = useDispatch();
  const [name, setName] = useState("");

  const handleCreate = (event) => {
    event.preventDefault();
    if (name !== "") {
      dispatch(addCollection({ collection: name }));
      // alert(`New Collection: "${name}" added.`);
      setName("");
    }
  };

  const allCollections = useSelector((state) => state.collections);
  const [collections, setCollections] = useState(undefined);
  const [selectedCollection, setSelectedCollection] = useState("");

  const handleCollectionChange = (event) => {
    dispatch(setSelected({ collection: event.target.value }));
  };

  useEffect(() => {
    if (allCollections) {
      setCollections(allCollections.collections);
      setSelectedCollection(allCollections.selected);
    }
  }, [allCollections]);

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed" style={{ background: "snow" }}>
          <Toolbar>
            <Typography
              variant="h4"
              component="div"
              sx={{ flexGrow: 1 }}
              style={{
                fontFamily: "monospace",
                fontWeight: "bolder",
                color: "#424242",
              }}
            >
              Collections
            </Typography>

            <FormControl
              variant="standard"
              sx={{ minWidth: 300 }}
              style={{ marginRight: 20 }}
            >
              <InputLabel
                id="collection"
                style={{
                  fontFamily: "monospace",
                  fontWeight: "bold",
                }}
              >
                Select a Collection
              </InputLabel>
              <Select
                labelId="collection"
                value={selectedCollection}
                onChange={handleCollectionChange}
                style={{
                  fontFamily: "monospace",
                  fontWeight: "bold",
                }}
              >
                <MenuItem
                  value=""
                  style={{
                    fontFamily: "monospace",
                    fontWeight: "bold",
                  }}
                >
                  None
                </MenuItem>
                {collections &&
                  Object.keys(collections).map((collection, i) => {
                    return (
                      <MenuItem
                        value={collection}
                        key={i}
                        style={{
                          fontFamily: "monospace",
                          fontWeight: "bold",
                        }}
                      >
                        {collection} ({collections[collection].length}
                        /20)
                      </MenuItem>
                    );
                  })}
              </Select>
            </FormControl>

            <Button
              variant="contained"
              style={{
                borderRadius: 100,
                fontFamily: "monospace",
                fontWeight: "bold",
                backgroundColor: "#424242",
                marginRight: 10,
              }}
              color="inherit"
              onClick={() => {
                persistor.purge();
                location.reload();
              }}
            >
              Reset State
            </Button>

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
                // navigate("/marvel-comics/page/1");
                navigate(-1);
              }}
            >
              &lt; Back
            </Button>
          </Toolbar>
        </AppBar>
      </Box>

      <Grid container marginTop={10} justifyContent="center">
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <TextField
            variant="standard"
            label="New Collection"
            value={name}
            onInput={(e) => setName(e.target.value)}
            InputLabelProps={{
              sx: {
                fontFamily: "monospace",
                fontWeight: "bold",
              },
            }}
            style={{
              fontFamily: "monospace",
              fontWeight: "bold",
              color: "#424242",
              marginRight: 5,
            }}
            sx={{ minWidth: 200 }}
          />
          <Button
            variant="contained"
            style={{
              borderRadius: 100,
              fontFamily: "monospace",
              fontWeight: "bold",
              color: "#424242",
            }}
            color="inherit"
            onClick={handleCreate}
          >
            Create
          </Button>
        </div>
      </Grid>

      <Grid container direction={"column"} spacing={2} marginTop={1}>
        {collections &&
          Object.keys(collections).map((name, i) => {
            const collectionData = { name: name, comics: collections[name] };
            return <CollectionCard collectionData={collectionData} key={i} />;
          })}
      </Grid>
    </div>
  );
}

export default Collections;
