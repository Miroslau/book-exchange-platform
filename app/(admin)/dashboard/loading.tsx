import { CardSkeleton, CardsSkeleton } from "@/app/ui/skeletons";

export default function Loading() {
  return (
    <div className="flex gap-8">
      <CardsSkeleton />
    </div>
  );
}
