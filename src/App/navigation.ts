export const navigationItems = [
  {
    icon: "mdi-home",
    name: "Home",
    exact: false,
    to: {
      path: "/posts",
    },
  },
  {
    icon: "mdi-cog",
    name: "Settings",
    exact: false,
    to: {
      path: "/settings",
    },
  },
  {
    icon: "mdi-braille",
    name: "Post suggester",
    exact: true,
    to: {
      path: "/suggester",
    },
  },
  {
    icon: "mdi-graph",
    name: "Stats",
    exact: true,
    to: {
      path: "/analyzer",
    },
  },
];
