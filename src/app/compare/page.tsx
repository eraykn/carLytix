"use client";

import { CompareSection } from "@/components/sections/Compare/CompareSection";
import { useEffect, useState } from "react";
import type { CarEntry } from "@/components/sections/Compare/CompareSection";

export default function ComparePage() {
  const [cars, setCars] = useState<CarEntry[]>([]);

  useEffect(() => {
    fetch("/api/cars")
      .then((res) => res.json())
      .then((data) => {
        setCars(data);
      })
      .catch((error) => {
        console.error("Error fetching cars:", error);
      });
  }, []);

  return <CompareSection initialData={cars} />;
}
