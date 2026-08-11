import {getAuth} from "@clerk/nextjs/server"
import { NextResponse } from "next/server";
import prisma from "@/prisma/client";
import authSeller from "@/utils/authSeller";

//get store info and store products
export async function GET(request) {
    try {
        //getr store username from query params
        const {searchParams} = new URL(request.url)
        const username = searchParams.get("username").toLowerCase()

        if(!username){
            return NextResponse.json({error: "missing store username"}, {status: 400})
        }

        //get store info and instock products with ratings
        const store = await prisma.store.findUnique({
            where: {username, isActive: true},
            include: {
                products: {
                    where: {inStock: true},
                    include: {ratings: true}
                }
            }
        })

        if(!store){
            return NextResponse.json({error: "store not found"}, {status: 404})
        }

        return NextResponse.json({store})

    } catch (error) {
        console.error(error);
        return NextResponse.json({error: error.code || error.message}, {status: 400});
    }
}