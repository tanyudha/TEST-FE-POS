import { todayDate } from "~/utils/TimeUtil";

export const state = () => ({
  date: todayDate() as any,
});

export type GlobalState = ReturnType<typeof state>;
