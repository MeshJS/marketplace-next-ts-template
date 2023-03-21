export default function Toast({ children, show = false }) {
  return (
    <div
      className={`fixed flex items-center w-full max-w-xs p-4 space-x-4 text-gray-500 bg-white divide-x divide-gray-200 rounded-lg shadow top-5 right-5 dark:text-gray-400 dark:divide-gray-700 space-x dark:bg-gray-800 z-50 ${
        !show && "hidden"
      }`}
    >
      <div className="ml-3 text-sm font-normal">{children}</div>
    </div>
  );
}
