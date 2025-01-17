"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "./ui/button";
import { ImageIcon, X } from "lucide-react";
import { useCoverImage } from "@/hooks/use-cover-image";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { useEdgeStore } from "@/lib/edgestore";
import { Skeleton } from "./ui/skeleton";

interface CoverImageProps{
    url?:string;
    preview?:boolean
}

export const Cover =({
    url,
    preview
}: CoverImageProps)=>{
    const {edgestore} = useEdgeStore();
    const coverImage = useCoverImage();
    const removeCover = useMutation(api.document.removeCover);
    const params = useParams();
    return(
        <div 
            className={cn("relative w-full h-[35vh] group",
                !url && "h-[12vh]",
                url && "bg-muted"
            )}
        >
            {!!url && (
                <Image src={url} fill alt="Cover" className="object-cover"/>
            )}
            {
                url && !preview && (
                    <div className="opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2">
                        <Button onClick={()=>{coverImage.onReplace(url)}} className="text-muted-foreground text-xs " size="sm" variant="outline"> <ImageIcon className="h-4 w-4 mr-3"/> Change cover</Button>
                        <Button onClick={async ()=>{
                            if(url)
                            {
                               await edgestore.publicFiles.delete({
                                url
                            })
                        }
                            removeCover({
                                id:params.documentId as Id<"documents">
                            })
                        }} className="text-muted-foreground text-xs " size="sm" variant="outline"> <X className="h-4 w-4 mr-3"/> Remove cover</Button>
                    </div>
                )
            }
        </div>
    )
}

Cover.Skeleton = function CoverSkeleton(){
    return(
        <Skeleton  className="w-full h-[12vh]"/>
    )
}