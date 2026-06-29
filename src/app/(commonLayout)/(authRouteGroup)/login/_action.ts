/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpClient } from "@/lib/axios/httpClient";
import { ApiErrorResponse } from "@/types/api.types";
import { ILoginResponse } from "@/types/auth.types";
import { ILoginPayload, loginZodSchema } from "@/zod/auth.validation";

export const loginAction=async(payload:ILoginPayload):Promise<ILoginResponse | ApiErrorResponse>=>{
    const parsedPayload=loginZodSchema.safeParse(payload);
    if(!parsedPayload.success){
        const firstError=parsedPayload.error.issues[0].message || "Invalid Input";
        return{
            success:false,
            message:firstError,
            
        }
    }
    try{
 const response=await httpClient.post<ILoginResponse>("/auth/login",parsedPayload.data);
 const {accessToken,refreshToken,token,user}=response.data;
 return response.data;
    }catch(error:any){
return{
    message:`Login failed:${error.message}`,
    success:false,
}
    }
}