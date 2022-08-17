// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { exampleRouter } from "./example";
import { protectedExampleRouter } from "./protected-example-router";
import { userRouter } from "./user";
import { postRouter } from "./post";

export const appRouter = createRouter().transformer(superjson).merge("users.", userRouter).merge("posts.", postRouter).merge("example.", exampleRouter).merge("question.", protectedExampleRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
