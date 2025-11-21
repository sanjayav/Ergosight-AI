export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-gray-200 border-t-mahindra-red rounded-full animate-spin"></div>
        <div className="mt-4 text-center text-gray-600 font-medium">Loading ErgoSight...</div>
      </div>
    </div>
  );
}

