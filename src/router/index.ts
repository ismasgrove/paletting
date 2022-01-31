import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Canvas from "../components/Canvas.vue";
import Options from "../components/Options.vue";
import ImageUpload from "../components/ImageUpload.vue";
import Explore from "../components/Explore.vue";
import Home from "../components/Home.vue"

import useStore from "../store/useStore";
import { getActivePinia } from "pinia";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/editor",
    name: "Editor",
    components: {
      Options,
      Canvas,
    },
    beforeEnter: () => {
      if (getActivePinia() !== undefined && !useStore().loaded) return "/";
    }
  },
  {
    path: "/explore",
    name: "Explore",
    component: Explore,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
