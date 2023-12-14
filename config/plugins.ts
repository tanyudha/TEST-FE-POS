import { NuxtOptionsPlugin } from "@nuxt/types/config/plugin";

const plugins: NuxtOptionsPlugin[] = [
  "@/plugins/auth",
  "@/plugins/api",
  "@/plugins/dayjs",
  "@/plugins/modified",
  "@/plugins/axios",
];

export default plugins;
