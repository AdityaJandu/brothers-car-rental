import { z } from "zod";
import { carInsertSchema } from "./schemas";
import { car } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

// Extract the TypeScript type from the Zod schema
export type CarInsertInput = z.infer<typeof carInsertSchema>;

// export type Car = InferSelectModel<typeof car>;

export enum CarStatus {
    Available = "available",
    Rented = "rented",
    Maintenance = "maintenance",
};

