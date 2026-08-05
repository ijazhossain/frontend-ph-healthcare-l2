import DoctorsTable from "@/components/modules/Admin/DoctorsManagement/DoctorsTable";
import { getAllSpecialties } from "@/services/specialty.service";
import { getDoctors } from "@/services/doctor.services";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

const DoctorsManagementPage = async({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const queryParamsObject = await searchParams;

  const queryString = Object.entries(queryParamsObject)
    .flatMap(([key, value]) =>
      Array.isArray(value)
        ? value.map((item) => `${encodeURIComponent(key)}=${encodeURIComponent(item)}`)
        : value !== undefined
        ? [`${encodeURIComponent(key)}=${encodeURIComponent(value)}`]
        : []
    )
    .join("&");

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["specialties"],
    queryFn: getAllSpecialties,
  });
  await queryClient.prefetchQuery({
    queryKey: ["doctors", queryParamsObject],
    queryFn: () => getDoctors(queryString),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 6,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DoctorsTable queryString={queryString} queryParamsObject={queryParamsObject} specialties={queryClient.getQueryData(["specialties"]) || []} />
    </HydrationBoundary>
  );
}
export default DoctorsManagementPage