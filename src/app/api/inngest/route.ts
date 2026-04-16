import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import {
    allFunctions
} from "@/inngest/index";

export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: allFunctions,
});