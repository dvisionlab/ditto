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
    path: "/auth",
    name: "auth",
    component: () => import("@/examples/auth/Test")
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
        components: {
          default: { template: "<div>Home</div>" },
          navLeft: () => import("@/examples/wireframes/basic/HomeNavLeft")
        }
      },
      {
        name: "basic-wireframe-other",
        path: "other",
        components: {
          default: { template: "<div>Other</div>" },
          navLeft: () => import("@/examples/wireframes/basic/OtherNavLeft")
        }
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
  },
  {
    path: "/dicom",
    name: "dicom",
    component: () => import("@/examples/dicom/Test")
  },
  {
    path: "/http",
    name: "http",
    component: () => import("@/examples/http/Test")
  }
];

const router = new VueRouter({
  mode: "history",
  routes
});

export default router;
