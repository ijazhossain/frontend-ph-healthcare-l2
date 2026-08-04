"use client";

import DataTable from "@/components/shared/table/DataTable";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getDoctors } from "@/services/doctor.services";
import { IDoctor } from "@/types/doctor.types";
import { useQuery } from "@tanstack/react-query";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable
} from "@tanstack/react-table";
import { doctorColumns } from "./doctorColumns";


const DoctorsTable = ({queryString,queryParamsObject}:{queryString:string;queryParamsObject:{[key: string]: string | string[] | undefined }}) => {

    // const doctorColumns:ColumnDef<IDoctor>[] = [
    //   { accessorKey: "name", header: "Name" },
    // //   { accessorKey: "specialization", header: "Specialization" },
    //   { accessorKey: "experience", header: "Experience" },
    // //   { accessorKey: "rating", header: "Rating" },
    // ];

   

    const { data : doctorDataResponse,isLoading } = useQuery({
        queryKey: ["doctors",queryParamsObject],
        queryFn: ()=>getDoctors(queryString)
    });

    const { data : doctors } = doctorDataResponse! || [];
const handleView=(doctor:IDoctor)=>{
    console.log("View doctor", doctor);
}
const handleEdit=(doctor:IDoctor)=>{
    console.log("Edit doctor", doctor);
}
const handleDelete=(doctor:IDoctor)=>{
    console.log("Delete doctor", doctor);
}

    const { getHeaderGroups, getRowModel } = useReactTable({
       data: doctors,
       columns: doctorColumns,
       getCoreRowModel: getCoreRowModel(),
    });   

    // console.log(doctorDataResponse?.data.map(doctor => doctor.name));

    // console.log(doctors);
  return (
   <DataTable 
   data={doctors}
   columns={doctorColumns}
   isLoading={isLoading}
   emptyMessage="No doctors found"
   actions={
{
    onView:handleView,
    onEdit:handleEdit,
    onDelete:handleDelete

}
   }
   />
  );
}

export default DoctorsTable