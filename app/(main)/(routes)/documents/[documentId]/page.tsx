"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { Toolbar } from "@/components/toolbar";
import { Cover } from "@/components/cover";
import { Skeleton } from "@/components/ui/skeleton";

import { useMemo } from "react";
import dynamic from "next/dynamic";


interface DocumentIdPageProps{
    params:{
        documentId:Id<"documents">
    }
}

const DocumentIdPage = ({
    params
}:DocumentIdPageProps)=>{

    const Editor = useMemo(()=>
        dynamic(()=>import("@/components/editor"),{ssr:false})
    ,[])

    const update = useMutation(api.document.update);

    const onChange = (content:string)=>{
        update({
            id:params.documentId,
            content
        })
    }

    const document = useQuery(api.document.getById,{
        documentId:params.documentId
    });
    if(document === undefined){
        return(
            <div>
                <Cover.Skeleton/>
                <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
                    <div className="space-y-4 pl-8 pt-4">
                        <Skeleton className="h-14 w-[50%]"/>
                        <Skeleton className="h-14 w-[80%]"/>
                        <Skeleton className="h-14 w-[40%]"/>
                        <Skeleton className="h-14 w-[60%]"/>
                    </div>
                </div>
            </div>

        )
    }
    if(document ===  null){
        return <div>Not found</div>
    }
    return(
        <div className="pb-40">
            <Cover url={document.coverImage}/>
            <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
                <Toolbar initialData={document}/>
                <Editor editable onChange={onChange} initialContent = {document.content!}/>
            </div>
        </div>
    )
}

export default DocumentIdPage;