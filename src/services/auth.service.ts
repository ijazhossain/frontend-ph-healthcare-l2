import { httpClient } from "@/lib/axios/httpClient"

const getDoctors=async()=>{
    const doctors=await httpClient.get('/doctors');
    return doctors;
}