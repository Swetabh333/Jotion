"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useConvexAuth } from "convex/react";
import { Spinner } from "./spinner";
import Link from "next/link";
import { SignInButton } from "@clerk/clerk-react";

export const Heading = ()=>{
    const {isAuthenticated,isLoading} = useConvexAuth();
    return(
        <div className="max-w-3xl space-y-4">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">Welcome to the connected workspace. <span className="underline">Jotion</span></h1>
            <h3 className="text-base sm:text-xl md:text-2xl font-medium">Jotion is the conected workspace where <br />better,faster work happens</h3>
            {
                isLoading && (
                    <div className="w-full flex items-center justify-center">
                        <Spinner size="lg"></Spinner>
                    </div>
                )
            }
            {
            isAuthenticated && !isLoading && (<Button asChild>
                <Link href="/documents">
                Enter Jotion <ArrowRight className="h-4 w-4 ml-2"></ArrowRight>
                </Link>
            </Button>)
            }
            {
                !isLoading && !isAuthenticated && (
                    <SignInButton mode="modal">
                        <Button>Get Jotion Free <ArrowRight className="h-4 w-4 ml-2"></ArrowRight></Button>
                    </SignInButton>
                )
            }
        </div>
    )
}