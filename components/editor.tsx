"use client";

import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { useTheme } from "next-themes";
import { useEdgeStore } from "@/lib/edgestore";


interface EditorProps{
    onChange: (content:string)=> void,
    initialContent:string;
    editable:boolean
}

const Editor = ({
    onChange,
    initialContent,
    editable
}:EditorProps)=>{

    const {edgestore} = useEdgeStore();

    const handleUpload = async (file:File)=>{
        const response = await edgestore.publicFiles.upload({file});
        return response.url;
    }
    const {resolvedTheme} = useTheme();
    const editor:BlockNoteEditor = useCreateBlockNote({
        initialContent: initialContent ? JSON.parse(initialContent) as PartialBlock[] : undefined,
        uploadFile:handleUpload
    });

    return(
        <BlockNoteView editable={editable} onChange={()=>{onChange(JSON.stringify(editor.document))}} editor={editor} theme={resolvedTheme==="dark"?"dark":"light"}/>
    )
}

export default Editor;