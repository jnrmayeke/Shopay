import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { authSeller } from "@/utils/authSeller";
import imageKit from "@/configs/imageKit";

// create the store
export async function POST(request){
    try {
        const {userId} = getAuth(request)
        //Get the data from the form
        const formData = await request.formData()

        const name = formData.get("name")
        const username = formData.get("username")
        const description = formData.get("description")
        const email = formData.get("email")
        const contact = formData.get("contact")
        const address = formData.get("address")
        const image = formData.get("image")

        if(!name || !username || !description || !email || !contact || !address || !image){
            return NextResponse.json({error: "missing store info"}, {status: 400})
        }

        //check if user has already registered a store
        const store = await prisma.store.findFirst({
            where: { userId: userId}
        })

        //if store is already registered then send status of store
        if(store){
            return NextResponse.json({status: store.status})
        }

        //check if username is already taken
        const isUsernameTaken = await prisma.store.findFirst({
            where: {username: username.toLowerCase()}
        })

        if(isUsernameTaken){
            return NextResponse.json({error: "username already taken"}, {status: 400})
        }

        //image upload to imagekit
        const buffer = Buffer.from(await image.arrayBuffer());
        const response = await imageKit.upload({
            file: buffer,
            fileName: image.name,
            folder: "logos"
        })

        const optimizedImage = imageKit.url({
            path: response.filePath, transformation: [
                { quality: "auto", format: "webp", height: "200", width: "200" }
            ]
        })

        const newStore = await prisma.store.create({
            data: {
                userId: userId,
                name: name,
                username: username.toLowerCase(),
                description: description,
                email: email,
                contact: contact,
                address: address,
                logoUrl: optimizedImage
            }
        })

        //link store to user
        await prisma.user.update({
            where: {id: userId},
            data: {store: {connect: {id: newStore.id}}}
        })

        return NextResponse.json({message: "applied, waiting for approval"}, {status: 200})

    } catch (error) {
        console.error(error);
        return NextResponse.json({error: error.code || error.message}, {status: 400});
    }
}

// check if user has already registered a store: if yes, return the status of the store
export async function GET(request) {
    try {
        const {userId} = getAuth(request);

        const store = await prisma.store.findFirst({
            where: { userId: userId }
        });

        // If store is already registered, return the status of the store
        if (store) {
            return NextResponse.json({ status: store.status });
        }

        return NextResponse.json({ status: "not registered" })

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.code || error.message }, { status: 400 });
    }
}