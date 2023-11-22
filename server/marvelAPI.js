import md5 from "blueimp-md5";

const BASE_URL = "https://gateway.marvel.com/v1/public/";
const PUBLIC_KEY = "e56b423d6498a6751e0b69d1cba076d2";
const PRIVATE_KEY = "6dad67e2bf288a9ba14bc736ae242d3df0a84398";

export const comic_url = (
  id,
  public_key = PUBLIC_KEY,
  private_key = PRIVATE_KEY
) => {
  const ts = new Date().getTime();
  const stringToHash = ts + private_key + public_key;
  const hash = md5(stringToHash);
  const url = `${BASE_URL}comics/${id}?ts=${ts}&apikey=${public_key}&hash=${hash}`;
  return url;
};

export const comics_url = (
  offset,
  searchTerm,
  public_key = PUBLIC_KEY,
  private_key = PRIVATE_KEY
) => {
  const ts = new Date().getTime();
  const stringToHash = ts + private_key + public_key;
  const hash = md5(stringToHash);
  let url = `${BASE_URL}comics?ts=${ts}&apikey=${public_key}&hash=${hash}&offset=${offset}`;

  if (searchTerm) url = `${url}&titleStartsWith=${searchTerm}`;

  return url;
};
