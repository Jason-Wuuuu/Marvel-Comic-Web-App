import { GraphQLError } from "graphql";
import axios from "axios";
import redis from "redis";
import * as api from "./marvelAPI.js";

const client = redis.createClient();
client.connect().then(() => {});

export const resolvers = {
  Query: {
    comics: async (_, args) => {
      // check if page is in cache
      if (args.searchTerm)
        args.searchTerm = args.searchTerm.toLowerCase().trim();

      if (
        await client.exists(
          `page_offset_${args.offset}_searchTerm_${args.searchTerm}`
        )
      ) {
        // console.log("Page is in cache.");
        const cached_page = await client.get(
          `page_offset_${args.offset}_searchTerm_${args.searchTerm}`
        );
        return JSON.parse(cached_page);
      }

      // console.log("Page not in cache.");
      // page not in cache
      const api_url = api.comics_url(args.offset, args.searchTerm);
      // console.log(api_url);
      const data = await axios.get(api_url);

      if (data.data.code === 200 && data.data.data.count !== 0) {
        const results = data.data.data;

        // add page to cache
        const jsonPageInfo = JSON.stringify(results);
        await client.set(
          `page_offset_${args.offset}_searchTerm_${args.searchTerm}`,
          jsonPageInfo
        );
        // console.log("Page added to cache.");

        return results;
      } else {
        //can't find comics
        throw new GraphQLError("Comics Not Found", {
          extensions: { code: "NOT_FOUND" },
        });
      }
    },
    getComicById: async (_, args) => {
      // check if comic is in cache
      if (await client.exists(`comic_${args._id}`)) {
        // console.log("Comic is in cache.");
        const cached_comic = await client.get(`comic_${args._id}`);
        return JSON.parse(cached_comic);
      }

      // console.log("Comic not in cache.");
      // comic not in cache
      const api_url = api.comic_url(args._id);
      let data = undefined;

      try {
        data = await axios.get(api_url);
      } catch (error) {
        throw new GraphQLError("Comic Not Found", {
          extensions: { code: error.code },
        });
      }

      if (data.data.code === 200) {
        const comic = data.data.data.results[0];

        // add comic to cache
        const jsonComicInfo = JSON.stringify(comic);
        await client.set(`comic_${args._id}`, jsonComicInfo);
        // console.log("Comic added to cache.");

        return comic;
      }
    },
  },

  Comic: {
    thumbnail: (parentValue) => {
      const thumbnail = parentValue.thumbnail;
      const url = `${thumbnail.path}.${thumbnail.extension}`;
      return url;
    },
    onSaleDate: (parentValue) => {
      const onSaleDate = parentValue.dates[0].date;
      return onSaleDate;
    },
    printPrice: (parentValue) => {
      const printPrice = parentValue.prices[0].price;
      return printPrice;
    },
  },

  Comics: {
    total: (parentValue) => {
      return parentValue.total;
    },
    limit: (parentValue) => {
      return parentValue.limit;
    },
    count: (parentValue) => {
      return parentValue.count;
    },
    comics: (parentValue) => {
      return parentValue.results;
    },
  },
};
