"use client";

import DataTable from "@/components/shared/table/DataTable";
import { getDoctors } from "@/services/doctor.services";
import { IDoctor } from "@/types/doctor.types";
import { useQuery } from "@tanstack/react-query";
import { SortingState } from "@tanstack/react-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { doctorColumns } from "./doctorColumns";

const getSortingStateFromParams = (queryParamsObject: { [key: string]: string | string[] | undefined }) => {
  const sortBy = typeof queryParamsObject.sortBy === "string" ? queryParamsObject.sortBy : undefined;
  const sortOrder = typeof queryParamsObject.sortOrder === "string" ? queryParamsObject.sortOrder : undefined;

  if (!sortBy) return [];

  return [{ id: sortBy, desc: sortOrder === "desc" }];
};

const DoctorsTable = ({
  queryString,
  queryParamsObject,
}: {
  queryString: string;
  queryParamsObject: { [key: string]: string | string[] | undefined };
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const sorting = useMemo<SortingState>(() => {
    const paramsFromUrl = Object.fromEntries(searchParams.entries());
    const resolvedParams = Object.keys(paramsFromUrl).length > 0 ? paramsFromUrl : queryParamsObject;

    return getSortingStateFromParams(resolvedParams);
  }, [queryParamsObject, searchParams]);

  const currentQueryParams = useMemo(() => new URLSearchParams(searchParams.toString()), [searchParams]);
  const currentQueryString = useMemo(() => currentQueryParams.toString(), [currentQueryParams]);
  const effectiveQueryString = currentQueryString || queryString;

  const { data: doctorDataResponse, isFetching } = useQuery({
    queryKey: ["doctors", effectiveQueryString],
    queryFn: () => getDoctors(effectiveQueryString),
    placeholderData: (previousData) => previousData,
  });

  const doctors = doctorDataResponse?.data ?? [];

  const handleView = (doctor: IDoctor) => {
    console.log("View doctor", doctor);
  };

  const handleEdit = (doctor: IDoctor) => {
    console.log("Edit doctor", doctor);
  };

  const handleDelete = (doctor: IDoctor) => {
    console.log("Delete doctor", doctor);
  };

  const handleSortingChange = (nextSorting: SortingState) => {
    const params = new URLSearchParams(searchParams.toString());

    if (nextSorting.length > 0) {
      const [sort] = nextSorting;
      params.set("sortBy", sort.id);
      params.set("sortOrder", sort.desc ? "desc" : "asc");
    } else {
      params.delete("sortBy");
      params.delete("sortOrder");
    }

    const targetUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(targetUrl, { scroll: false });
  };

  return (
    <DataTable
      data={doctors}
      columns={doctorColumns}
      isLoading={isFetching}
      emptyMessage="No doctors found"
      sorting={{ state: sorting, onSortingChange: handleSortingChange }}
      actions={{
        onView: handleView,
        onEdit: handleEdit,
        onDelete: handleDelete,
      }}
    />
  );
};

export default DoctorsTable;