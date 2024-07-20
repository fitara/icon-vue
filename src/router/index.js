import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import Meeting from "../views/Meeting.vue";

const routes = [
  { path: "/", redirect: "/dashboard" },
  { path: "/dashboard", name: "Dashboard", component: Dashboard },
  { path: "/meeting/:view?", name: "Meeting", component: Meeting },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
