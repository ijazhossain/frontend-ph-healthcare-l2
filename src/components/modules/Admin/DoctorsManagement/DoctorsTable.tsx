"use client";

import DataTable from "@/components/shared/table/DataTable";
import FilterPanel, { FilterOption } from "@/components/shared/table/FilterPanel";
import { getDoctors } from "@/services/doctor.services";
import { IDoctor } from "@/types/doctor.types";
import { ISpecialty } from "@/types/specialty.types";
import { useQuery } from "@tanstack/react-query";
import { SortingState } from "@tanstack/react-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { doctorColumns } from "./doctorColumns";

const getSortingStateFromParams = (queryParamsObject: { [key: string]: string | string[] | undefined }) => {
  const sortBy = typeof queryParamsObject.sortBy === "string" ? queryParamsObject.sortBy : undefined;
  const sortOrder = typeof queryParamsObject.sortOrder === "string" ? queryParamsObject.sortOrder : undefined;

  if (!sortBy) return [];

  return [{ id: sortBy, desc: sortOrder === "desc" }];
};

const parseNumberParam = (value: string | string[] | null | undefined, fallback: number) => {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = raw ? Number(raw) : NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const GENDERS: FilterOption[] = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
];

const DoctorsTable = ({
  queryString,
  queryParamsObject,
  specialties,
}: {
  queryString: string;
  queryParamsObject: { [key: string]: string | string[] | undefined };
  specialties: ISpecialty[];
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

  const page = parseNumberParam(currentQueryParams.get("page"), 1);
  const pageSize = parseNumberParam(currentQueryParams.get("limit"), 10);
  const initialSearchTerm = useMemo(() => {
    const urlTerm = searchParams.get("searchTerm");
    if (typeof urlTerm === "string") return urlTerm;
    return typeof queryParamsObject.searchTerm === "string" ? queryParamsObject.searchTerm : "";
  }, [queryParamsObject.searchTerm, searchParams]);

  const initialGender = useMemo(() => {
    const value = searchParams.get("gender");
    return typeof value === "string" ? value : typeof queryParamsObject.gender === "string" ? queryParamsObject.gender : null;
  }, [queryParamsObject.gender, searchParams]);

  const initialFeeMin = useMemo(() => {
    const value = searchParams.get("appointmentFee[gte]") ?? (typeof queryParamsObject["appointmentFee[gte]"] === "string" ? queryParamsObject["appointmentFee[gte]"] : "");
    return value ? Number(value) : "";
  }, [queryParamsObject, searchParams]);

  const initialFeeMax = useMemo(() => {
    const value = searchParams.get("appointmentFee[lte]") ?? (typeof queryParamsObject["appointmentFee[lte]"] === "string" ? queryParamsObject["appointmentFee[lte]"] : "");
    return value ? Number(value) : "";
  }, [queryParamsObject, searchParams]);

  const initialSpecialties = useMemo(() => {
    const entries = searchParams.getAll("specialties.specialty.title");
    if (entries.length > 0) return entries;
    const raw = queryParamsObject["specialties.specialty.title"];
    if (Array.isArray(raw)) return raw;
    if (typeof raw === "string") return [raw];
    return [];
  }, [queryParamsObject, searchParams]);

  const [searchValue, setSearchValue] = useState<string>(() => initialSearchTerm);
  const [genderFilter, setGenderFilter] = useState<string | null>(() => initialGender);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>(() => initialSpecialties);
  const [feeRange, setFeeRange] = useState<{ min: number | ""; max: number | "" }>(() => ({
    min: initialFeeMin,
    max: initialFeeMax,
  }));
  const loadingToastId = useRef<string | number | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (searchValue.trim()) {
      params.set("searchTerm", searchValue.trim());
    } else {
      params.delete("searchTerm");
    }

    params.set("page", "1");
    const targetUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    const currentUrl = searchParams.toString() ? `${pathname}?${searchParams.toString()}` : pathname;

    if (targetUrl === currentUrl) return;

    const handler = window.setTimeout(() => {
      router.replace(targetUrl, { scroll: false });
    }, 450);

    return () => window.clearTimeout(handler);
  }, [searchValue, searchParams, pathname, router]);

  const { data: doctorDataResponse, isFetching } = useQuery({
    queryKey: ["doctors", effectiveQueryString],
    queryFn: () => getDoctors(effectiveQueryString),
    placeholderData: (previousData) => previousData,
  });

  useEffect(() => {
    if (isFetching) {
      if (!loadingToastId.current) {
        loadingToastId.current = toast.loading("Loading doctors...");
      }
      return;
    }

    if (loadingToastId.current) {
      toast.dismiss(loadingToastId.current);
      loadingToastId.current = null;
    }
  }, [isFetching]);

  const doctors = doctorDataResponse?.data ?? [];
  const pageCount = doctorDataResponse?.meta?.totalPages ?? 1;
  const totalItems = doctorDataResponse?.meta?.total ?? doctors.length;

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

  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (genderFilter) {
      params.set("gender", genderFilter);
    } else {
      params.delete("gender");
    }

    params.delete("specialties.specialty.title");
    selectedSpecialties.forEach((specialty) => params.append("specialties.specialty.title", specialty));

    if (feeRange.min !== "") {
      params.set("appointmentFee[gte]", String(feeRange.min));
    } else {
      params.delete("appointmentFee[gte]");
    }

    if (feeRange.max !== "") {
      params.set("appointmentFee[lte]", String(feeRange.max));
    } else {
      params.delete("appointmentFee[lte]");
    }

    params.set("page", "1");
    const targetUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(targetUrl, { scroll: false });
  };

  const handleClearFilters = () => {
    setGenderFilter(null);
    setSelectedSpecialties([]);
    setFeeRange({ min: "", max: "" });

    const params = new URLSearchParams(searchParams.toString());
    params.delete("gender");
    params.delete("specialties.specialty.title");
    params.delete("appointmentFee[gte]");
    params.delete("appointmentFee[lte]");
    params.set("page", "1");

    const targetUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(targetUrl, { scroll: false });
  };

  const filterItems = [
    {
      type: "multi" as const,
      label: "Specialties",
      selected: selectedSpecialties,
      options: specialties.map((specialty) => ({
        value: specialty.title,
        label: specialty.title,
      })),
      onChange: setSelectedSpecialties,
    },
    {
      type: "single" as const,
      label: "Gender",
      selected: genderFilter,
      options: GENDERS,
      onChange: setGenderFilter,
    },
    {
      type: "range" as const,
      label: "Appointment Fee",
      min: feeRange.min,
      max: feeRange.max,
      placeholder: "Amount",
      onChange: setFeeRange,
    },
  ];

  return (
    <DataTable
      data={doctors}
      columns={doctorColumns}
      isLoading={false}
      emptyMessage="No doctors found"
      filtering={<FilterPanel items={filterItems} onApply={handleApplyFilters} onClear={handleClearFilters} />}
      sorting={{ state: sorting, onSortingChange: handleSortingChange }}
      search={{
        value: searchValue,
        onChange: setSearchValue,
        onClear: () => setSearchValue(""),
        placeholder: "Search doctors",
      }}
      pagination={{
        pageIndex: page - 1,
        pageSize,
        pageCount,
        totalItems,
        onPageChange: (nextPageIndex) => {
          const params = new URLSearchParams(searchParams.toString());
          params.set("page", String(nextPageIndex + 1));
          const targetUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
          router.replace(targetUrl, { scroll: false });
        },
        onPageSizeChange: (nextPageSize) => {
          const params = new URLSearchParams(searchParams.toString());
          params.set("limit", String(nextPageSize));
          params.set("page", "1");
          const targetUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
          router.replace(targetUrl, { scroll: false });
        },
      }}
      actions={{
        onView: handleView,
        onEdit: handleEdit,
        onDelete: handleDelete,
      }}
    />
  );
};

export default DoctorsTable;