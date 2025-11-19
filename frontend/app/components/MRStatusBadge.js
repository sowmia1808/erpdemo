export default function MRStatusBadge({ status }) {
  const styles = {
    PENDING: "bg-yellow-100 text-yellow-700 border-yellow-300",
    APPROVED: "bg-green-100 text-green-700 border-green-300",
    REJECTED: "bg-red-100 text-red-700 border-red-300",
    PROCUREMENT_PENDING: "bg-blue-100 text-blue-700 border-blue-300",
    COMPLETED: "bg-gray-200 text-gray-700 border-gray-300",
  };

  return (
    <span
      className={`text-xs px-3 py-1 rounded-full border font-medium ${styles[status]}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}
