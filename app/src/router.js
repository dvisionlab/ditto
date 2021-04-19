import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("@/components/Home")
  },
  {
    path: "/basic-wireframe",
    name: "basic-wireframe",
    redirect: "/basic-wireframe/home",
    component: () => import("@/examples/wireframes/basic/Root"),
    children: [
      {
        name: "basic-wireframe-home",
        path: "home",
        component: { template: "<div>Home</div>" }
      },
      {
        name: "basic-wireframe-other",
        path: "other",
        component: { template: "<div>Other</div>" }
      }
    ]
  },
  {
    path: "/double-navigation-wireframe",
    name: "double-navigation-wireframe",
    redirect: "/double-navigation-wireframe/home",
    component: () => import("@/examples/wireframes/double-navigation/Root"),
    children: [
      {
        name: "double-navigation-wireframe-home",
        path: "home",
        component: { template: "<div>Home</div>" }
      },
      {
        name: "double-navigation-wireframe-other",
        path: "other",
        component: { template: "<div>Other</div>" }
      }
    ]
  }
];

const router = new VueRouter({
  mode: "history",
  routes
});

export default router;
