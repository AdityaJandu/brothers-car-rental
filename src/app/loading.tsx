import { LoadingState } from "@/components/self/loading-state";

const Loading = () => {

    return (
        <LoadingState
            title={"Redirecting"}
            descr={"Please wait while we're redirecting"}
        />
    )
}

export default Loading;