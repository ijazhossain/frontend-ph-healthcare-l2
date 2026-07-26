
"use client";

import { getDoctors } from "@/app/(commonLayout)/consultation/_actions";
import { useQuery } from "@tanstack/react-query";

const DoctorsList = () => {
  const { data } = useQuery({
    queryKey: ["doctors"],
    queryFn: () => getDoctors(),
  });

  // Safe access using optional chaining and fallback
  const doctors = data?.data ?? [];

  return (
    <div>
      {doctors.map((doctor) => (
        <div key={doctor.id}>{doctor.name}</div>
      ))}
    </div>
  );
};

export default DoctorsList;