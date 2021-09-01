var { graphqlHTTP } = require("express-graphql");
var { buildSchema, assertInputType } = require("graphql");
var express = require("express");

// Construct a schema, using GraphQL schema language
var restaurants = [
  {
    id: 1,
    name: "WoodsHill ",
    description:
      "American cuisine, farm to table, with fresh produce every day",
    dishes: [
      {
        name: "Swordfish grill",
        price: 27,
      },
      {
        name: "Roasted Broccily ",
        price: 11,
      },
    ],
  },
  {
    id: 2,
    name: "Fiorellas",
    description:
      "Italian-American home cooked food with fresh pasta and sauces",
    dishes: [
      {
        name: "Flatbread",
        price: 14,
      },
      {
        name: "Carbonara",
        price: 18,
      },
      {
        name: "Spaghetti",
        price: 19,
      },
    ],
  },
  {
    id: 3,
    name: "Karma",
    description:
      "Malaysian-Chinese-Japanese fusion, with great bar and bartenders",
    dishes: [
      {
        name: "Dragon Roll",
        price: 12,
      },
      {
        name: "Pancake roll ",
        price: 11,
      },
      {
        name: "Cod cakes",
        price: 13,
      },
    ],
  },
];
var schema = buildSchema(`
type Query{
  restaurant(id: Int): restaurant
  restaurants: [restaurant]
},
type restaurant {
  id: Int
  name: String
  description: String
  dishes:[Dish]
}

type Dish{
  name: String
  price: Int
}
input restaurantInput{
  name: String
  description: String
}

type DeleteResponse{
  ok: Boolean!
}
type Mutation{
  setrestaurant(input: restaurantInput): restaurant

  deleterestaurant(id: Int!): DeleteResponse
  editrestaurant(id: Int!, name: String!): restaurant
}
`);
// The root provides a resolver function for each API endpoint


var root = {
  restaurant: (arg) => {
    // Your code goes here
    console.log(`restaurants[${arg.id}]: `, restaurants[arg.id]);
    return restaurants[arg.id];
  },
  restaurants: () => {
    // Your code goes here
    console.log("restaurants: ", restaurants);
    return restaurants;
  },
  setrestaurant: ({ input }) => {
    // Your code goes here
    let newId = restaurants.length + 1;
    restaurants.push({id: newId, name:input.name, description: input.description, dishes: input.dishes});
    return input;
  },
  deleterestaurant: ({ id }) => {
    // Your code goes here
    var filteredRestaurants = [];
    const copiedRestaurants = [];
    const ok = Boolean(restaurants[id]);

    restaurants.forEach(elem => console.log(`elem.id: ${elem.id} | id: ${id} | ${elem.id !== id}`));
    let delIndex = restaurants.findIndex( (ele) => ele.id == id);
    console.log(`delIndex: ${delIndex}`);
    let delc = restaurants[delIndex];

    filteredRestaurants = restaurants.filter((element) => {element.id != id})
    console.log(`Filtered restaurants: `, filteredRestaurants);

    for (let i = 0; i < delIndex; i++){
      copiedRestaurants.push(restaurants[i]);
    }
    for (let j = delIndex + 1; j < restaurants.length; j++){
      copiedRestaurants.push(restaurants[j]);
    }
    console.log(`Copied restaurants: `, copiedRestaurants);

    restaurants = copiedRestaurants;
    console.log(JSON.stringify(delc));
    return {ok}
  },
  editrestaurant: ({ id, ...restaurant }) => {
    // Your code goes here
    let editIndex = restaurants.findIndex( (ele) => ele.id == id);
    if(editIndex == -1){
      throw new Error("restaurant does not exist")
    }
    restaurants[editIndex] = {
      ...restaurants[editIndex],...restaurant
    }
    return restaurants[editIndex];
  },
};
var app = express();
app.use("/graphql",  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  }));
var port = 5500;
app.listen(5500, () => console.log("Running Graphql on Port:" + port));

// export default root;
