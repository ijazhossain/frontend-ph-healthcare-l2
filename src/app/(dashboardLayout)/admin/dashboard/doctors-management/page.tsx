import DoctorsTable from "@/components/modules/Admin/DoctorsManagement/DoctorsTable";
import { getDoctors } from "@/services/doctor.services";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

const DoctorsManagementPage = async({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const queryParamsObject = await searchParams;

  // console.log( queryParamsObjects);
  /* 
  {
  searchTerm: "cardio",
  page: "1",
  limit: "10",
  gender: "MALE",
  "appointmentFee[gt]": "500",
}
  */
  //?searchTerm=cardio&page=1&limit=10&gender=MALE&appointmentFee[gt]=500
  // const queryString=Object.keys(queryParamsObjects).map((key)=>`${key}=${queryParamsObjects[key]}`).join("&");
  // console.log(queryString);
  //if the value is an array, we need to convert it to multiple query params with the same key
  const queryString=Object.keys(queryParamsObject).map((key)=>{
    const value =queryParamsObject[key];
    if(Array.isArray(value)){
      return value.map((v)=>`${key}=${v}`).join("&");
    }
    return `${key}=${value}`;
  }).join("&");
console.log(queryString,"querystring");
  const queryClient=new QueryClient()
   await queryClient.prefetchQuery({
      queryKey: ["doctors",queryParamsObject],
      queryFn: ()=>getDoctors(queryString),
        staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 6, // 1 hour
    });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DoctorsTable queryString={queryString} queryParamsObject={queryParamsObject}/>
    </HydrationBoundary>
  )
}
export default DoctorsManagementPage