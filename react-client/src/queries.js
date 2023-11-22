import { gql } from "@apollo/client";

export const GET_COMICS = gql`
  query ($offset: Int!, $searchTerm: String) {
    comics(offset: $offset, searchTerm: $searchTerm) {
      total
      limit
      count
      comics {
        id
        title
        thumbnail
      }
    }
  }
`;

export const GET_COMIC = gql`
  query ($comicId: Int!) {
    getComicById(_id: $comicId) {
      id
      title
      thumbnail
      description
      pageCount
      onSaleDate
      printPrice
    }
  }
`;
