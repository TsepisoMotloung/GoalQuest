import { LoaderCircle } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex h-full min-h-[calc(100vh-12rem)] w-full items-center justify-center">
      <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}
