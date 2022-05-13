import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("@/components/AppHome.vue")
  },
  {
    path: "/auth",
    name: "auth",
    component: () => import("@/examples/auth/AuthTest.vue")
  },
  {
    path: "/basic-wireframe",
    name: "basic-wireframe",
    redirect: "/basic-wireframe/home",
    component: () => import("@/examples/wireframes/basic/Root.vue"),
    children: [
      {
        name: "basic-wireframe-home",
        path: "home",
        components: {
          default: { template: "<div>Home</div>" },
          navLeft: () => import("@/examples/wireframes/basic/HomeNavLeft.vue")
        }
      },
      {
        name: "basic-wireframe-other",
        path: "other",
        components: {
          default: { template: "<div>Other</div>" },
          navLeft: () => import("@/examples/wireframes/basic/OtherNavLeft.vue")
        }
      }
    ]
  },
  {
    path: "/double-navigation-wireframe",
    name: "double-navigation-wireframe",
    redirect: "/double-navigation-wireframe/home",
    component: () => import("@/examples/wireframes/double-navigation/Root.vue"),
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
    path: "/data-types",
    name: "data-types",
    component: () => import("@/examples/data-types/DataTypesTest.vue")
  },
  {
    path: "/dicom",
    name: "dicom",
    component: () => import("@/examples/dicom/DicomTest.vue")
  },
  {
    path: "/form",
    name: "form",
    component: () => import("@/examples/form/FormTest.vue")
  },
  {
    path: "/http",
    name: "http",
    component: () => import("@/examples/http/HttpTest.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  routes
});

export default router;
