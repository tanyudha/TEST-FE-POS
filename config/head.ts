import { NuxtOptionsHead } from "@nuxt/types/config/head";

const head: NuxtOptionsHead = {
  title: "Admin | Aleya Frozen",
  htmlAttrs: {
    lang: "en",
  },
  meta: [
    { charset: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { hid: "description", name: "description", content: "" },
    { name: "format-detection", content: "telephone=no" },
    { hid: "robots", name: "robots", content: "noindex nofollow" },
  ],
  link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
};

export default head;
