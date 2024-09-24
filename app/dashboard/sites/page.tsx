import prisma from "@/app/utils/db";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Item } from "@radix-ui/react-dropdown-menu";
import { FileIcon, PlusCircle, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import Defaultimage from "@/public/default.png";

async function getData(userId: string) {
    const data = await prisma.site.findMany({
        where: {
            userId: userId,
        },
        orderBy: {
            createdAt:"desc",
        },
    });
    return data;
    
}

export default async function SitesRoutes () {
    const {getUser} = getKindeServerSession();
    const user = await getUser;
    
    if(!user){
        return redirect("/api/auth/login");
    }
    const data = await getData (user.id);
return(
    <>
    <div className="flex w-full justify-end">
        <Button asChild>
            <Link href={"/dashboard/sites/new"}><PlusCircle className="mr-2 size-4" /> Creat Site</Link>
        </Button>
    </div>

    {data === undefined || data.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
        <div className="flex size-20 items-center justify-center rounded-full bg-primary/10">
        <FileIcon className="size-10 text-primary" />
        </div>
        <h2 className="mt-6 text-xl font-semibold">You dont have any sites created.</h2>
        <p className="mb-8 mt-2 text-sm text-center leading-tight text-muted-foreground max-w-sm mx-auto">you currently dont have any Sites. Please create some so that you can see them right here.</p>
        <Button asChild>
              <Link href={"/dashboard/sites/new"}><PlusCircle className="mr-2 size-4" /> Creat Site</Link>
          </Button>
      </div>
    ): (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
            {data.map((item) => (
                <Card key={item.id}>
                    <Image 
                    
                    src={item.imageUrl ?? Defaultimage}
                    alt={item.name} 
                    className="rounded-t-lg object-cover w-full h-[200px]"
                    width={400}
                    height={200}
                     />
                     <CardHeader>
                        <CardTitle>{item.name}</CardTitle>
                        <CardDescription>{item.description}</CardDescription>
                     </CardHeader>

                     <CardFooter>
                        <Button asChild className="w-full">
                            <Link href={`/dashboard/sites/${item.id}`}>View Articals</Link>
                        </Button>
                     </CardFooter>
                </Card>
            ))}
        </div>
    )}
    </>
)
}