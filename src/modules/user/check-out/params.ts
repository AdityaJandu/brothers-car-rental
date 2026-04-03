import { DEFAULT_PAGE } from "@/constants";


import { parseAsInteger, createLoader } from "nuqs/server";

export const filtersSearchParamsBooking = {
    page: parseAsInteger.withDefault(DEFAULT_PAGE).withOptions({ clearOnDefault: true }),
};

export const loadSearchParamsBooking = createLoader(filtersSearchParamsBooking);