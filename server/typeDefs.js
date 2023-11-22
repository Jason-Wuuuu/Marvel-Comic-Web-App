export const typeDefs = `#graphql
    type Query {
        comics(offset: Int!, searchTerm: String): Comics,
        getComicById(_id: Int!): Comic,
    }

    type Comic {
        id: Int
        title: String
        thumbnail: String
        description: String
        pageCount: Int
        onSaleDate: String 
        printPrice: Float
    }

    type Comics {
        total: Int
        limit: Int,
        count: Int,
        comics: [Comic]
    }
`;
