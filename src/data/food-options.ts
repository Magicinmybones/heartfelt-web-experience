export type FoodOption = {
  name: string;
  emoji: string;
  note: string;
};

export const foodOptions: FoodOption[] = [
  { name: "Pizza", emoji: "🍕", note: "cheesy & classic" },
  { name: "Sushi", emoji: "🍣", note: "tiny fancy bites" },
  { name: "Pasta", emoji: "🍝", note: "main character energy" },
  { name: "Burger", emoji: "🍔", note: "messy but worth it" },
  { name: "Tacos", emoji: "🌮", note: "always a good idea" },
  { name: "Ramen", emoji: "🍜", note: "cozy bowl moment" },
];
