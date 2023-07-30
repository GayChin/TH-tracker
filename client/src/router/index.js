import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "historical",
      component: () => import("../views/HistoricalView.vue"),
    },
    {
      path: "/realtime",
      name: "realtime",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/RealtimeView.vue"),
    },
    {
      path: "/chart",
      name: "chart",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../components/LineChart.vue"),
    },
  ],
});

export default router;
