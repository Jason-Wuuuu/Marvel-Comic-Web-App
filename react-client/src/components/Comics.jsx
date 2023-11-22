import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useQuery } from "@apollo/client";
import { GET_COMICS } from "../queries";

import { useSelector, useDispatch } from "react-redux";
import { setSelected } from "../reducers/collectionReducer";

import ComicCard from "./ComicCard";
import { Error } from "./Error";

import {
  Grid,
  Pagination,
  Button,
  FormControl,
  InputLabel,
  Typography,
  Select,
  AppBar,
  MenuItem,
  Toolbar,
  Box,
  TextField,
} from "@mui/material";

function Comics() {
  // page
  const { pagenum } = useParams();
  const offset = parseInt(pagenum - 1) * 20;

  // navigation
  const navigate = useNavigate();
  const handlePageChange = (e, value) => {
    navigate(`/marvel-comics/page/${value}`);
  };
  const [pages, setPages] = useState(1);

  // comic data
  const dummyCards = () => {
    const cards = [];
    for (let i = 0; i < 20; i++) {
      cards.push(<ComicCard />);
    }
    return cards;
  };

  // redux
  const dispatch = useDispatch();
  const allCollections = useSelector((state) => state.collections);
  const [collectionOptions, setCollectionOptions] = useState(undefined);
  const [selectedCollection, setSelectedCollection] = useState("");

  const handleCollectionChange = (event) => {
    dispatch(setSelected({ collection: event.target.value }));
  };

  // search
  const [searchBox, setSearchBox] = useState("");
  const [searchTerm, setSearchTerm] = useState(undefined);

  const handleSearch = (event) => {
    event.preventDefault();
    setSearchBox(searchBox.trim());
    searchBox === "" ? setSearchTerm(undefined) : setSearchTerm(searchBox);
  };

  const handleClearSearch = (event) => {
    event.preventDefault();
    setSearchBox("");
    setSearchTerm(undefined);
    navigate("/marvel-comics/page/1");
  };

  const [total, setTotal] = useState(undefined);
  const [limit, setLimit] = useState(undefined);
  const [count, setCount] = useState(undefined);
  const [comics, setComics] = useState(dummyCards());

  const { loading, error, data } = useQuery(GET_COMICS, {
    variables: { offset, searchTerm },
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    if (!loading && !error) {
      if (data.comics.total && total !== data.comics.total)
        setTotal(data.comics.total);

      if (data.comics.limit && limit !== data.comics.limit)
        setLimit(data.comics.limit);

      if (data.comics.count && count !== data.comics.count)
        setCount(data.comics.count);

      if (data.comics.comics) setComics(data.comics.comics);
    } else {
      setComics(dummyCards());
    }
  }, [pagenum, loading]);

  useEffect(() => {
    if (allCollections) {
      setSelectedCollection(allCollections.selected);
      setCollectionOptions(Object.keys(allCollections.collections));
    }
  }, [allCollections]);

  useEffect(() => {
    if (total && limit) {
      setPages(Math.ceil(total / limit));
    }
  }, [total, limit]);

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
                component="div"
                sx={{ flexGrow: 1 }}
                style={{
                  fontFamily: "monospace",
                  fontWeight: "bolder",
                  color: "#424242",
                }}
              >
                Comics
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
                  Please Select a Collection
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
                variant="contained"
                style={{
                  borderRadius: 100,
                  fontFamily: "monospace",
                  fontWeight: "bold",
                  backgroundColor: "#424242",
                }}
                color="inherit"
                onClick={() => {
                  navigate("/marvel-comics/collections");
                }}
              >
                View Collections
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
              label="Search"
              value={searchBox}
              onInput={(e) => setSearchBox(e.target.value)}
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
              onClick={handleSearch}
            >
              Search
            </Button>

            {searchTerm && (
              <Button
                variant="contained"
                style={{
                  borderRadius: 100,
                  fontFamily: "monospace",
                  fontWeight: "bold",
                  color: "#424242",
                  marginLeft: 10,
                }}
                color="inherit"
                onClick={handleClearSearch}
              >
                Clear Search
              </Button>
            )}
          </div>
        </Grid>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <Grid
            container
            spacing={2}
            marginTop={1}
            justifyContent="center"
            style={{
              maxWidth: "90vw",
            }}
          >
            {comics.map((comic, i) => {
              return (
                <ComicCard
                  comicData={comic}
                  key={comic.id ? comic.id : i}
                  collection={selectedCollection}
                />
              );
            })}
          </Grid>
        </div>

        <Grid container marginTop={3} marginBottom={3} justifyContent="center">
          <Pagination
            count={pages}
            page={parseInt(pagenum)}
            onChange={handlePageChange}
            boundaryCount={2}
            siblingCount={2}
            size="large"
          />
        </Grid>
      </div>
    );
  }
}

export default Comics;
