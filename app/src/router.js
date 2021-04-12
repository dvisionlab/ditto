import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

const routes = [
  {
    path: "/basic-wireframe",
    name: "basic-wireframe",
    component: () => import("./examples/wireframes/BasicWireframe")
  }
];

const router = new VueRouter({
  mode: "history",
  routes
});

export default router;
