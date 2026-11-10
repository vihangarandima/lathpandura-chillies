/* ------------------------------------------------------------------
   Chilies Lathpandura — site content
   Edit this file to change the menu, prices and photos.

   PHOTOS: every photo here is a stock stand-in from Unsplash.
   To use the restaurant's own photos, drop them in an /images folder
   and replace the img value with e.g. "images/biriyani.jpg".

   PRICES: only the tandoori chicken biriyani price (Rs. 1,540) comes
   from the restaurant's Facebook page. Every other price and dish
   name is a PLACEHOLDER and must be confirmed before going live.
------------------------------------------------------------------- */

const photo = (id, size = 520) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${size}&h=${size}&q=75`;

window.CHILIES = {
  orderPhone: "+94779344300",
  orderPhoneLabel: "077 934 4300",

  categories: [
    { id: "all", label: "All" },
    { id: "rice", label: "Rice & biriyani" },
    { id: "grill", label: "Grill & seafood" },
    { id: "burgers", label: "Burgers" },
    { id: "drinks", label: "Drinks" },
    { id: "pastries", label: "Pastries" },
  ],

  // heat: 0 = none, 1 = mild, 2 = medium, 3 = hot
  menu: [
    {
      id: "tandoori-biriyani",
      name: "Tandoori chicken biriyani",
      note: "This week it comes with a free mint mojito.",
      price: 1540, // confirmed on Facebook (weekly offer)
      heat: 2,
      cat: "rice",
      img: photo("1631515243349-e0cb75fb8d3a"),
    },
    {
      id: "mixed-fried-rice",
      name: "Mixed fried rice",
      note: "Wok-fried with chicken, egg and vegetables.",
      price: 1250, // placeholder
      heat: 1,
      cat: "rice",
      img: photo("1603133872878-684f208fb84b"),
    },
    {
      id: "devilled-chicken",
      name: "Devilled chicken",
      note: "Tossed hot with capsicum, onion and chilli.",
      price: 1450, // placeholder
      heat: 3,
      cat: "grill",
      img: photo("1628294895950-9805252327bc"),
    },
    {
      id: "grilled-chicken",
      name: "Grilled half chicken",
      note: "Marinated overnight, charred over the grill.",
      price: 1890, // placeholder
      heat: 2,
      cat: "grill",
      img: photo("1610057099431-d73a1c9d2f2f"),
    },
    {
      id: "chicken-skewers",
      name: "Chicken skewers",
      note: "Tandoori-spiced, straight off the coals.",
      price: 1150, // placeholder
      heat: 2,
      cat: "grill",
      img: photo("1599487488170-d11ec9c172f0"),
    },
    {
      id: "prawn-curry",
      name: "Prawn curry",
      note: "Prawns in a rich, spiced gravy with rice.",
      price: 1950, // placeholder
      heat: 2,
      cat: "grill",
      img: photo("1559847844-5315695dadae"),
    },
    {
      id: "crispy-chicken-burger",
      name: "Crispy chicken burger",
      note: "Fried chicken, lettuce and house sauce, with fries.",
      price: 1090, // placeholder
      heat: 1,
      cat: "burgers",
      img: photo("1551782450-a2132b4ba21d"),
    },
    {
      id: "beef-burger",
      name: "Double beef burger",
      note: "Two patties, cheese, pickles, toasted bun.",
      price: 1390, // placeholder
      heat: 1,
      cat: "burgers",
      img: photo("1568901346375-23c9450c58cd"),
    },
    {
      id: "mint-mojito",
      name: "Mint mojito",
      note: "Lime, crushed mint and plenty of ice.",
      price: 590, // placeholder
      heat: 0,
      cat: "drinks",
      img: photo("1513558161293-cdaf765ed2fd"),
    },
    {
      id: "lime-cooler",
      name: "Iced lime cooler",
      note: "Cold, sharp and made for the heat.",
      price: 490, // placeholder
      heat: 0,
      cat: "drinks",
      img: photo("1556679343-c7306c1976bc"),
    },
    {
      id: "croissant",
      name: "Butter croissant",
      note: "Baked for the counter each morning.",
      price: 380, // placeholder
      heat: 0,
      cat: "pastries",
      img: photo("1555507036-ab1f4038808a"),
    },
    {
      id: "chocolate-cake",
      name: "Chocolate fudge cake",
      note: "By the slice, or whole to order.",
      price: 650, // placeholder
      heat: 0,
      cat: "pastries",
      img: photo("1578985545062-69928b1d9587"),
    },
  ],

  // Photos that drift past under the "spice day" headline
  strip: [
    "1563379091339-03b21ab4a4f8",
    "1610057099431-d73a1c9d2f2f",
    "1559847844-5315695dadae",
    "1551782450-a2132b4ba21d",
    "1513558161293-cdaf765ed2fd",
    "1628294895950-9805252327bc",
    "1555507036-ab1f4038808a",
    "1603133872878-684f208fb84b",
  ].map((id) => photo(id, 360)),
};
