import { DEFAULT_PAGE } from "@/constants";


import { parseAsInteger, parseAsString, createLoader } from "nuqs/server";

export const filtersSearchParamsUser = {
    search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
    page: parseAsInteger.withDefault(DEFAULT_PAGE).withOptions({ clearOnDefault: true }),
};

export const loadSearchParamsUser = createLoader(filtersSearchParamsUser);