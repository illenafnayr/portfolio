import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Maze from "../components/games/maze/Maze.vue"


const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/games/maze",
    name: "Maze",
    component: Maze
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
