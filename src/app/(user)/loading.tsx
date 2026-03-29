import { LoadingState } from "@/components/self/loading-state";

export default function Loading() {
    return (
        <LoadingState title={"Redirecting..."} descr={"Please wait while we redirect you."} />
    );
}