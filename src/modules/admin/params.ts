import { DEFAULT_PAGE } from "@/constants";
import { CarStatus } from "./types";

import { parseAsInteger, parseAsString, createLoader, parseAsStringEnum } from "nuqs/server";

export const filtersSearchParams = {
    search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
    page: parseAsInteger.withDefault(DEFAULT_PAGE).withOptions({ clearOnDefault: true }),
    status: parseAsStringEnum(Object.values(CarStatus)),
};

export const loadSearchParams = createLoader(filtersSearchParams);