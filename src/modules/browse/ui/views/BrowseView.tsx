import { CarGrid } from "../components/CarGrid";
import { FiltersBar } from "../components/FiltersBar";


export function BrowseView() {
    return (
        <div className="min-h-screen px-6 lg:px-12 py-8">

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-primary font-heading">
                    Browse Cars
                </h1>
                <p className="text-muted-foreground mt-1">
                    Find the perfect ride for your journey
                </p>
            </div>

            {/* Filters */}
            <FiltersBar />

            {/* Cars */}
            <CarGrid />

        </div>
    );
}