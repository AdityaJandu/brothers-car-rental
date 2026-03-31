import { DEFAULT_PAGE } from "@/constants";


import { parseAsInteger, parseAsString, createLoader, parseAsStringEnum } from "nuqs/server";
import { CarStatus } from "./types";

export const filtersSearchParams = {
    search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
    page: parseAsInteger.withDefault(DEFAULT_PAGE).withOptions({ clearOnDefault: true }),
    status: parseAsStringEnum(Object.values(CarStatus)),
};

export const loadSearchParams = createLoader(filtersSearchParams);