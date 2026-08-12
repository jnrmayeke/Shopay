import { getAuth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server";
import prisma from "@/prisma/client";
import authAdmin from "@/utils/authAdmin";


// Aprove Seller
export async function POST(request) {
    try {
        const {userId} = getAuth(request)
        const isAdmin = await authAdmin(userId)

        if(!isAdmin){
            return NextResponse.json({error: "user is not an admin"}, {status: 401})
        }

        const {storeId, status} = await request.json()

        if(status === 'approved'){
            await prisma.store.update({
                where: {id: storeId},
                data: {status: 'approved', isActive: true}
            })
            return NextResponse.json({message: "store approved successfully"})
        } else if(status === 'rejected'){
            await prisma.store.update({
                where: {id: storeId},
                data: {status: 'rejected'}
            })
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({error: error.code || error.message}, {status: 400});
    }
}


// get all pending and rejected stores
export async function GET(request){
    try {
        const {userId} = getAuth(request)
        const isAdmin = await authAdmin(userId)

        if (!isAdmin) {
            return NextResponse.json({error: 'unauthorized'}, {status: 401})
        }

        const stores = await prisma.store.findMany({
            where: {
                status: { in: ["pending", "rejected"]}
            },
            include: {user: true}
        })


    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.code || error.message}, {status: 400})
    }
}