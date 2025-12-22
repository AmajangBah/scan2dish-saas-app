// analytics/data/index.ts

export const currentWeek = [
  { name: "Chicken Shawarma", amount: 5000 },
  { name: "Beef Wrap", amount: 4200 },
  { name: "Fruit Juice", amount: 3800 },
  { name: "Chicken Burger", amount: 3100 },
  { name: "BBQ Wings", amount: 2900 },
];

export const lastWeek = [
  { name: "Chicken Shawarma", amount: 4300 },
  { name: "Beef Wrap", amount: 4400 },
  { name: "Fruit Juice", amount: 3500 },
  { name: "Chicken Burger", amount: 2800 },
  { name: "BBQ Wings", amount: 2600 },
];

// Optional: monthly mock data
export const monthlySales = {
  January: {
    revenue: 25000,
    orders: 1200,
    avgOrder: 155,
    returningCustomers: 52,
  },
  February: {
    revenue: 18000,
    orders: 900,
    avgOrder: 140,
    returningCustomers: 48,
  },
  March: {
    revenue: 31000,
    orders: 1420,
    avgOrder: 170,
    returningCustomers: 61,
  },
  // Add more months as needed
};

// Optional: category data by month
export const categorySalesByMonth = {
  January: [
    { name: "Drinks", value: 1400 },
    { name: "Food", value: 2500 },
    { name: "Deserts", value: 1700 },
    { name: "Other", value: 2100 },
  ],

  February: [
    { name: "Drinks", value: 1200 },
    { name: "Food", value: 2000 },
    { name: "Deserts", value: 1600 },
    { name: "Other", value: 1800 },
  ],

  March: [
    { name: "Drinks", value: 1500 },
    { name: "Food", value: 2700 },
    { name: "Deserts", value: 1900 },
    { name: "Other", value: 2300 },
  ],
};
