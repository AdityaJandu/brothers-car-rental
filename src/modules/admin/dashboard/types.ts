import { z } from "zod";
import { carInsertSchema } from "./schemas";

// Extract the TypeScript type from the Zod schema
export type CarInsertInput = z.infer<typeof carInsertSchema>;

export enum CarStatus {
    Available = "available",
    Rented = "rented",
    Maintenance = "maintenance",
};

