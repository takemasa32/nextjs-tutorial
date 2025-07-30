"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="px-6 py-3 bg-blue-500 text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors font-medium"
    >
      {pending ? "Creating..." : "Add Note"}
    </button>
  );
}
