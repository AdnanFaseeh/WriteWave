"use client";

import { CreatePostAction } from "@/app/actions";
import TailwindEditor from "@/app/dashboard/EditorWrapper";
import { UploadDropzone } from "@/app/utils/UploadthongComponents";
import { PostSchema } from "@/app/utils/zodSchemas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Label } from "@radix-ui/react-dropdown-menu";
import { ArrowLeft, Atom, Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { JSONContent } from "novel";
import { useActionState, useState } from "react";
import { toast } from "sonner";
import slugify from "react-slugify";
import { SubmitButton } from "@/app/components/form/SubmitButtons";

export default function ArticalCreateRoute ({params}: {params: {siteId: string}}){
    const [imageUrl, setImageUrl] = useState<undefined | string>(undefined);
    const [value, setValue] = useState<JSONContent | undefined>(undefined);
    const [title, setTitle] = useState<undefined | string>(undefined);
    const [slug, setSlugValue] = useState<undefined | string>(undefined);
    const [lastResult, action] = useActionState(CreatePostAction, undefined);
    const [form, fields] = useForm({
        lastResult,
        onValidate({formData}) {
            return parseWithZod(formData, {schema: PostSchema})
        },

        shouldValidate: "onBlur",
        shouldRevalidate: "onInput",
    });

    function handleSlugGeneration (){
   const titleInput = title;

    if(titleInput?.length === 0 || titleInput === undefined){
        return toast.error('Please create a title first');
        }
        setSlugValue(slugify(titleInput));
        return toast.success('Slug has been generated');
    }
    return (
        <>
        <div className="flex items-center">
          <Button size="icon" variant="outline" className="mr-3" asChild>
            <Link href={`/dashboard/sites/${params.siteId}`}>
            <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <h1 className="text-xl font-semibold">Creat Artical</h1>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Artical Details</CardTitle>
                <CardDescription>Lorem ipsum dolor sit amet.</CardDescription>
            </CardHeader>
            <CardContent>
                <form className="flex flex-col gap-6" id={form.id}
                 onSubmit={form.onSubmit}
                 action={action}>
                    <input type="hidden" name="siteId" value={params.siteId} />
                    <div className="grid gap-2">
                        <Label>Title</Label>
                        <Input key={fields.title.key}
                        name={fields.title.name}
                        defaultValue={fields.title.initialValue}
                        placeholder="Next js blogging Application"
                        onChange={(e)=>{
                            setTitle(e.target.value)
                        }}
                        value={title}
                         />
                         <p className="text-red-500 text-sm">{fields.title.errors}</p>
                    </div>
                    <div className="grid gap-2">
                        <Label>Slug</Label>
                        <Input key={fields.slug.key}
                        name={fields.slug.name}
                        defaultValue={fields.slug.initialValue}
                        placeholder="Artical Slug"
                        onChange={(e) => setSlugValue(e.target.value)}
                        value={slug}
                        />
                        <Button onClick={handleSlugGeneration} className="w-fit" variant="secondary" type="button">
                            <Atom className="size-4 mr-2" /> Generate Slug
                        </Button>
                        <p className="text-red-500 text-sm">{fields.slug.errors}</p>
                    </div>
                    <div className="grid gap-2">
                        <Label>Small Description</Label>
                        <Textarea 
                        key={fields.smallDescription.key}
                        name={fields.smallDescription.name}
                        defaultValue={fields.smallDescription.initialValue}
                        placeholder="Small description for your blog artical..."
                         className="h-32" />
                         <p className="text-red-500 text-sm">{fields.smallDescription.errors}</p>
                    </div>
                    <div className="grid gap-2">
                        <Label>Cover Image</Label>
                        <Input type="hidden" key={fields.coverImage.key}
                        name={fields.coverImage.name}
                        defaultValue={fields.coverImage.initialValue}
                        value={imageUrl}
                        placeholder="Artical Cover Image"
                         />
                    {imageUrl ? (
                         <Image src={imageUrl} alt="Upload Image" 
                         className="object-cover w-[200px] h-[200px] rounded-lg"
                         width={200}
                         height={200}/>
                    ): (
                        <UploadDropzone onClientUploadComplete={(res) => {
                            setImageUrl((res [0].url))
                            toast.success('Image has been uploaded')
                        }} endpoint="imageUploader"
                        onUploadError={()=>{
                            toast.error('Something went wrong...')
                        }}
                        />
                    )}
                   <p className="text-red-500 text-sm">{fields.coverImage.errors}</p>
                    </div>
                    <div className="grid gap-2">
                    <Label>Artical Content</Label>
                    <Input type="hidden" key={fields.articaleContent.key}
                    name={fields.articaleContent.name}
                    defaultValue={fields.articaleContent.initialValue}
                    value={JSON.stringify(value)}
                    placeholder="Artical Content"
                     />
                    <TailwindEditor onChange={setValue} initialValue={value} />
                    <p className="text-red-500 text-sm">{fields.articaleContent.errors}</p>
                    </div>
                    <SubmitButton text="Create Article"  />
                </form> 
            </CardContent>
        </Card>
        </>
    )
}