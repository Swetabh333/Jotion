import Image from "next/image";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";

const font = Poppins({
    subsets:["latin"],
    weight:["400","600"]
});

export const Logo = ()=>{
    return(
        <div className="hidden md:flex items-center gap-x-2">
            <Image
            src="/logo.svg"
            height="40"
            width="40"
            alt="logo"
            className="dark:hidden"></Image>
            <Image
            src="/logo-dark.svg"
            height="40"
            width="40"
            alt="logo"
            className="dark:block hidden"></Image>
            <p className={cn("font-semibold",font.className)}>Jotion</p>
        </div>
    )
}
