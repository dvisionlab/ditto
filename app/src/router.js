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
        components: {
          default: { template: "<div>Home</div>" },
          bar: { template: "<div>Header</div>" },
          "nav-left": { template: "<div>Left</div>" },
          "nav-right": { template: "<div>Right</div>" },
          footer: { template: "<div>Footer</div>" }
        }
      }
    ]
  }
];

const router = new VueRouter({
  mode: "history",
  routes
});

export default router;
