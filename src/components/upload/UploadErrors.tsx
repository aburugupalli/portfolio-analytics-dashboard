export function UploadErrors({ errors }: { errors: string[] }) {
  if (!errors.length) return null;
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-950 dark:bg-red-950/30 dark:text-red-200">
      {errors.map((error) => (
        <p key={error}>{error}</p>
      ))}
    </div>
  );
}
