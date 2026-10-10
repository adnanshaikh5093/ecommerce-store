export default function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null;
  const nums = Array.from({ length: pages }, (_, i) => i + 1).filter(
    (n) => n === 1 || n === pages || Math.abs(n - page) <= 1
  );
  return (
    <div className="mt-8 flex items-center justify-center gap-1">
      <button className="btn-outline" disabled={page === 1} onClick={() => onChange(page - 1)}>Prev</button>
      {nums.map((n, i) => (
        <span key={n} className="flex items-center gap-1">
          {i > 0 && n - nums[i - 1] > 1 && <span className="px-1 text-gray-400">…</span>}
          <button
            onClick={() => onChange(n)}
            className={`h-9 w-9 rounded-lg text-sm ${n === page ? "bg-indigo-600 text-white" : "bg-white border hover:bg-gray-100"}`}
          >{n}</button>
        </span>
      ))}
      <button className="btn-outline" disabled={page === pages} onClick={() => onChange(page + 1)}>Next</button>
    </div>
  );
}
