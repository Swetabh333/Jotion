"use client";
import { useScrollTop } from "@/hooks/use-scroll-top";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { ModeToggle } from "@/components/mode-toggle";
import { useConvexAuth } from "convex/react";
import { SignInButton,UserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "./spinner";
import Link from "next/link";

const Navbar = () => {
  const {isAuthenticated,isLoading} = useConvexAuth()
    const scrolled  = useScrollTop();
  return (
    <div className={cn("z-50 bg-background fixed top-0 flex dark:bg-[#1F1F1F] items-center w-full p-6",scrolled && "border-b shadow-sm")}>
      <Logo></Logo>
      <div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2">
        {isLoading && (<Spinner></Spinner>)}
        {!isAuthenticated && !isLoading &&(
          <>
            <SignInButton mode="modal">
              <Button variant={"ghost"} size="sm">Log in</Button>
            </SignInButton>
            <SignInButton mode="modal">
              <Button  size="sm">Get Jotion free</Button>
            </SignInButton>
          </>
        )}
        {
          isAuthenticated && !isLoading && (
            <>
              <Button variant={"ghost"} size={"sm"} asChild>
                <Link href="/documents">Enter Jotion</Link>
              </Button>
              <UserButton afterSwitchSessionUrl="/"/>
            </>
          )
        }
        <ModeToggle></ModeToggle>
      </div>
    </div>
  )
}

export default Navbar
