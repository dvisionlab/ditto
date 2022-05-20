import Vue from "vue";
import { DittoHttp } from "../library/http/types";

declare module "vue/types/vue" {
  // Global properties can be declared
  // on the `VueConstructor` interface
  interface VueConstructor<Vue> {
    $http: DittoHttp;
  }
}

