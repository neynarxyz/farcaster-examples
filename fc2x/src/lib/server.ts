"use server";

import { redirect } from "next/navigation";

export async function navigate(url: string){
    redirect(url);
}