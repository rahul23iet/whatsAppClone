import Loading from "../components/Loading";
import { Suspense } from "react";
import VerfiyOtp from "../components/verifyOtp";


export default function  VerfiyPage() {
    return (
        <Suspense fallback={<Loading />}>
            <VerfiyOtp/>
        </Suspense>
    )
}