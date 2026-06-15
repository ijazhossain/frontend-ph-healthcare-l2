/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"
import { getDoctors } from "@/app/(commonLayout)/consultation/_actions"
import { useQuery } from "@tanstack/react-query"

const DoctorsList = () => {
     const { data } = useQuery({
    queryKey: ['doctors'],
    queryFn: () => getDoctors(),
  })
  console.log(data);
  return (
    <div>{data.data.map((doctor:any)=>(<p key={doctor.id}>{doctor.name}</p>))}</div>
  )
}
export default DoctorsList