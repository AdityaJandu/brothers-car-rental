import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";

export type CarGetAll = inferRouterOutputs<AppRouter>["browse"]["getAll"]["items"];

export type GetOne = inferRouterOutputs<AppRouter>["browse"]["getOne"];
