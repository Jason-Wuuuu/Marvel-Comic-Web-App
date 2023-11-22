import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import {
  addComic,
  removeComic,
  setSelected,
} from "../reducers/collectionReducer";

import { useQuery } from "@apollo/client";
import { GET_COMIC } from "../queries";

import {
  Grid,
  Button,
  FormControl,
  InputLabel,
  Typography,
  Select,
  AppBar,
  MenuItem,
  Toolbar,
  Box,
  CardMedia,
} from "@mui/material";

import noImage from "../img/image_not_available.jpg";
import { Error } from "./Error";

function ComicDetail() {
  // navigation
  const navigate = useNavigate();

  const { id } = useParams();
  const comicId = parseInt(id);

  const { loading, error, data } = useQuery(GET_COMIC, {
    variables: { comicId },
    fetchPolicy: "cache-and-network",
  });

  const [title, setTitle] = useState("N/A");
  const [thumbnail, setThumbnail] = useState(noImage);
  const [description, setDescription] = useState("No Description ...");
  const [pageCount, setPageCount] = useState("N/A");
  const [onSaleDate, setOnSaleDate] = useState("N/A");
  const [printPrice, setPrintPrice] = useState("N/A");

  // redux
  const dispatch = useDispatch();
  const allCollections = useSelector((state) => state.collections);
  const [collectionOptions, setCollectionOptions] = useState(undefined);
  const [selectedCollection, setSelectedCollection] = useState("");

  const handleCollectionChange = (event) => {
    dispatch(setSelected({ collection: event.target.value }));
  };

  useEffect(() => {
    if (!loading && !error) {
      if (data.getComicById.title) setTitle(data.getComicById.title);
      if (data.getComicById.thumbnail)
        setThumbnail(data.getComicById.thumbnail);
      if (data.getComicById.description && data.getComicById.description !== "")
        setDescription(data.getComicById.description);
      if (data.getComicById.pageCount)
        setPageCount(data.getComicById.pageCount);
      if (data.getComicById.onSaleDate)
        setOnSaleDate(
          new Date(data.getComicById.onSaleDate).toLocaleDateString()
        );
      if (data.getComicById.printPrice)
        setPrintPrice(data.getComicById.printPrice);
    }
  }, [loading]);

  useEffect(() => {
    if (allCollections) {
      setSelectedCollection(allCollections.selected);
      setCollectionOptions(Object.keys(allCollections.collections));
    }
  }, [allCollections]);

  if (error) {
    const code = error.graphQLErrors[0].extensions.code;
    const errorCode = `${error.name}: ${code}`;
    return <Error errorCode={errorCode} errorMessage={error.message} />;
  } else {
    return (
      <div>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="fixed" style={{ background: "snow" }}>
            <Toolbar>
              <Typography
                variant="h4"
                sx={{ flexGrow: 1 }}
                style={{
                  fontFamily: "monospace",
                  fontWeight: "bolder",
                  color: "#424242",
                }}
              >
                Comic Detail
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
                  {collectionOptions &&
                    collectionOptions.map((option, i) => {
                      return (
                        <MenuItem
                          value={option}
                          key={i}
                          style={{
                            fontFamily: "monospace",
                            fontWeight: "bold",
                          }}
                        >
                          {option} ({allCollections.collections[option].length}
                          /20)
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>

              <Button
                variant="outlined"
                style={{
                  borderRadius: 100,
                  fontFamily: "monospace",
                  fontWeight: "bold",
                  backgroundColor: "#424242",
                }}
                color="inherit"
                onClick={() => {
                  navigate(-1);
                }}
              >
                &lt; Back
              </Button>
            </Toolbar>
          </AppBar>
        </Box>

        <div style={{ display: "flex", justifyContent: "center" }}>
          {loading ? (
            <Typography
              marginTop={12}
              variant="h4"
              sx={{
                fontFamily: "monospace",
                fontWeight: "bolder",
                color: "#424242",
              }}
            >
              Loading...
            </Typography>
          ) : (
            <Grid
              container
              direction="row"
              marginTop={12}
              component="main"
              style={{
                maxWidth: "70vw",
              }}
            >
              <Grid item xs>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <CardMedia
                    component="img"
                    image={thumbnail}
                    title="thumbnail"
                    sx={{
                      width: "auto",
                      height: "80vh",
                    }}
                  />
                </div>
              </Grid>

              <Grid item xs>
                <Grid container direction="column" padding={2} spacing={5}>
                  <Grid item xs>
                    <Typography
                      align="left"
                      variant="h5"
                      sx={{
                        fontFamily: "monospace",
                        fontWeight: "bolder",
                        color: "#242424",
                      }}
                    >
                      {title}
                    </Typography>
                  </Grid>

                  <Grid item xs>
                    <Typography
                      align="left"
                      variant="body"
                      sx={{
                        fontFamily: "monospace",
                        color: "#242424",
                      }}
                    >
                      {description}
                    </Typography>
                  </Grid>

                  <Grid item xs>
                    <Typography
                      align="left"
                      variant="body2"
                      sx={{
                        fontFamily: "monospace",
                        fontWeight: "bolder",
                        color: "#242424",
                      }}
                    >
                      PageCount: {pageCount}
                      <br></br>
                      onSaleDate: {onSaleDate}
                      <br></br>
                      printPrice: {printPrice}
                    </Typography>
                  </Grid>

                  <Grid item xs>
                    <Button
                      variant={"outlined"}
                      style={
                        selectedCollection !== ""
                          ? allCollections.collections[
                              selectedCollection
                            ].includes(comicId)
                            ? // collected
                              {
                                borderRadius: 100,
                                fontFamily: "monospace",
                                fontWeight: "bold",
                                borderColor: "#424242",
                                color: "#424242",
                              }
                            : // not collected
                              {
                                borderRadius: 100,
                                fontFamily: "monospace",
                                fontWeight: "bold",
                                backgroundColor: "#424242",
                                color: "snow",
                              }
                          : // no collection
                            {
                              borderRadius: 100,
                              fontFamily: "monospace",
                              fontWeight: "bold",
                              backgroundColor: "lightgray",
                              borderColor: "lightgray",
                              color: "#424242",
                            }
                      }
                      color="inherit"
                      disabled={selectedCollection === ""}
                      onClick={() => {
                        if (
                          allCollections.collections[
                            selectedCollection
                          ].includes(comicId)
                        ) {
                          dispatch(
                            removeComic({
                              collection: selectedCollection,
                              comicId: comicId,
                            })
                          );
                        } else {
                          if (
                            allCollections.collections[selectedCollection]
                              .length < 20
                          ) {
                            dispatch(
                              addComic({
                                collection: selectedCollection,
                                comicId: comicId,
                              })
                            );
                          } else {
                            alert(
                              "Collection can only have at most 20 comics."
                            );
                          }
                        }
                      }}
                    >
                      {selectedCollection !== ""
                        ? allCollections.collections[
                            selectedCollection
                          ].includes(comicId)
                          ? "Give Up"
                          : "Collect"
                        : "No Collection Selected"}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}
        </div>
      </div>
    );
  }
}
export default ComicDetail;
