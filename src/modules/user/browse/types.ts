import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";

export type CarGetAll = inferRouterOutputs<AppRouter>["userBrowse"]["getAll"]["items"];

export type GetOne = inferRouterOutputs<AppRouter>["userBrowse"]["getOne"];
