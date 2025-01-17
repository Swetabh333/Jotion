"use client";

import { cn } from "@/lib/utils";
import { ChevronsLeft, MenuIcon, Plus, PlusCircle, Search, Settings, Trash } from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { ElementRef, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import UserItem from "./user-item";
import Item from "./item";
import {useMutation} from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { DocumentList } from "./document-list";
import Navbar from "./navbar";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { TrashBox } from "./trash-box";
import { useSearch } from "@/hooks/use-search";
import { useSettings } from "@/hooks/use-settings";


export const Navigation = ()=>{
    const search = useSearch();
    const settings = useSettings();
    const router = useRouter();
    const isMobile = useMediaQuery("(max-width: 768px)");
    const create = useMutation(api.document.create);
    const params = useParams();
    const pathName = usePathname();
    const isResizingRef = useRef(false);
    const sideRef = useRef<ElementRef<"aside">>(null);
    const navbarRef = useRef<ElementRef<"div">>(null);
    const [isResetting,setIsResetting] = useState(false);
    const [isCollapsed,setIsCollapsed] = useState(isMobile);

    const handleCreate = ()=>{
        const promise = create({title:"Untitled"})
        .then((documentId)=>{
            router.push(`/documents/${documentId}`);
        })
        ;
        toast.promise(promise,{
            loading:"Creating new note...",
            success:"New note created",
            error:"Could not create a new note"
        })
    }

    const resetWidth = () =>{
        if(sideRef.current && navbarRef.current){
            setIsCollapsed(false);
            setIsResetting(true);

            sideRef.current.style.width = isMobile?"100%" : "240px";
            navbarRef.current.style.setProperty(
                "width",
                isMobile?"0":"calc(100%-240px)"
            );
            navbarRef.current.style.setProperty("left",isMobile?"100%":"240px");
            setTimeout(()=>{
                setIsResetting(false)
            },300) // because of the 300 ms transition timing
        }
    }

    useEffect(()=>{
        if(isMobile){
            collapse();
        }else{
            resetWidth();
        }
    },[isMobile,resetWidth]);

    useEffect(()=>{
        if(isMobile){
            collapse();
        }
    },[isMobile,pathName])

    const handleMouseDown = (event:React.MouseEvent<HTMLDivElement,MouseEvent>)=>{
        event.preventDefault();
        event.stopPropagation();
        isResizingRef.current = true;
        document.addEventListener("mousemove",handleMouseMove);
        document.addEventListener("mouseup",handleMouseUp);
    }

    const handleMouseMove = (event:MouseEvent)=>{
        if(!isResizingRef.current) return;
        let newWidth = event.clientX;

        if(newWidth<240) newWidth=240;
        if(newWidth>480) newWidth=480;
        if(sideRef.current && navbarRef.current){
            sideRef.current.style.width = `${newWidth}px`;
            navbarRef.current.style.setProperty("left",`${newWidth}px`);
            navbarRef.current.style.setProperty("width",`calc(100%-${newWidth}px)`)

        }
    }

    const handleMouseUp = ()=>{
        isResizingRef.current = false;
        document.removeEventListener("mouseup",handleMouseUp);
        document.removeEventListener("mousemove",handleMouseMove);
    }

    

    const collapse = ()=>{
        if(sideRef.current && navbarRef.current){
            setIsCollapsed(true);
            setIsResetting(true);

            sideRef.current.style.width = "0";
            navbarRef.current.style.setProperty("width","100%");
            navbarRef.current.style.setProperty("left","0");
            setTimeout(()=>{
                setIsResetting(false);
            },300);
        }
    }

    return(
        <>
            <aside ref={sideRef} className={cn("group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60 flex-col z-[99999]",
                isResetting && "transition-all ease-in-out duration-300",isMobile && "w-0"
            )}>
                <div role="button" onClick={collapse} className={cn("h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition",
                    isMobile && "opacity-100"
                )}>
                    <ChevronsLeft className="h-6 w-6"></ChevronsLeft>
                </div>
                <div>
                    <UserItem></UserItem>
                    <Item label="Search" icon={Search} isSearch onClick={search.onOpen}></Item>
                    <Item label="Settings" icon={Settings} onClick={settings.onOpen}></Item>
                    <Item onClick={handleCreate}
                    label="New page"
                    icon={PlusCircle}></Item>
                </div>
                <div className="mt-4">
                  
                  <DocumentList/>
                  <Item
                    onClick={handleCreate}
                    icon={Plus}
                    label="Add a page"
                  ></Item>
                  <Popover>
                    <PopoverTrigger className="w-full mt-4">
                        <Item label="Trash" icon={Trash}></Item>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-72" side={isMobile? "bottom":"right"}>
                        <TrashBox />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0" onMouseDown={handleMouseDown} 
                onClick={resetWidth}
                />
            </aside>
            <div ref={navbarRef} className={cn("absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]",
                isResetting && "transition-all ease-in-out duration-300",
                isMobile && "left-0 w-full"
            )}>
                {
                    !!params.documentId ? (
                        <Navbar
                        isCollapsed = {isCollapsed}
                        onResetWidth= {resetWidth}
                        />
                    )
                :(<nav className="bg-transparent px-3 py-2 w-full">
                    {isCollapsed && <MenuIcon className="h-6 w-6 text-muted-foreground" onClick={resetWidth}></MenuIcon>}
                </nav>)}
            </div>
        </>
    )
}