import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import AlienAttack from "../components/games/alien-attack/AlienAttack.vue"
import Maze from "../components/games/maze/Maze.vue"


const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/games/alien-attack",
    name: "AlienAttack",
    component: AlienAttack
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
