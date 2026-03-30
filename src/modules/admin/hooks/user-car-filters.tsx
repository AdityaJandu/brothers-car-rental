

import { DEFAULT_PAGE } from "@/constants";
import { parseAsInteger, parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";
import { CarStatus } from "../types";

export const useCarFilters = () => {
    return useQueryStates({
        search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
        page: parseAsInteger.withDefault(DEFAULT_PAGE).withOptions({ clearOnDefault: true }),
        status: parseAsStringEnum(Object.values(CarStatus)),
    });
}