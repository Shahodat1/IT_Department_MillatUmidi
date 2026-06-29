export default function AdminForm({
  title,
  fields = [],
  values = {},
  errors = {},
  loading = false,
  submitLabel = "Save",
  onChange,
  onSubmit,
  onCancel,
}) {
  const renderField = (field) => {
    const value = values[field.name];

    const commonProps = {
      id: field.name,
      name: field.name,
      required: field.required ?? false,
      disabled: field.disabled ?? false,
      className:
        "mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400",
    };

    if (field.type === "textarea") {
      const textareaValue =
        field.name === "tags" && Array.isArray(value)
          ? value.join(", ")
          : (value ?? "");

      return (
        <textarea
          {...commonProps}
          rows={field.rows || 4}
          placeholder={field.placeholder || ""}
          value={textareaValue}
          onChange={(e) => onChange(field.name, e.target.value)}
        />
      );
    }

    if (field.type === "select") {
      return (
        <select
          {...commonProps}
          value={value ?? ""}
          onChange={(e) => onChange(field.name, e.target.value)}
        >
          <option value="">Select...</option>
          {(field.options || []).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    if (field.type === "file") {
      return (
        <div className="space-y-2">
          <input
            {...commonProps}
            type="file"
            accept={field.accept || "*/*"}
            onChange={(e) => onChange(field.name, e.target.files?.[0] || null)}
          />

          {typeof value === "string" && value ? (
            field.accept?.includes("image") ? (
              <div className="overflow-hidden rounded-xl border border-slate-200">
                <img
                  src={value}
                  alt={field.label}
                  className="h-40 w-full object-cover"
                />
              </div>
            ) : (
              <a
                href={value}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-blue-600 underline"
              >
                Current file
              </a>
            )
          ) : value instanceof File ? (
            <p className="text-xs text-slate-500">Selected: {value.name}</p>
          ) : null}
        </div>
      );
    }

    if (field.type === "checkbox") {
      return (
        <label className="mt-2 flex items-center gap-3 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(field.name, e.target.checked)}
            className="h-4 w-4 rounded border-slate-300"
          />
          {field.checkboxLabel || field.label}
        </label>
      );
    }

    return (
      <input
        {...commonProps}
        type={field.type || "text"}
        placeholder={field.placeholder || ""}
        value={value ?? ""}
        onChange={(e) => onChange(field.name, e.target.value)}
      />
    );
  };

  return (
    <form
      onSubmit={onSubmit}
      className="max-h-[80vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
    >
      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-slate-900">{title}</h3>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {fields.map((field) => (
          <div
            key={field.name}
            className={field.fullWidth ? "md:col-span-2" : ""}
          >
            <label
              htmlFor={field.name}
              className="text-sm font-medium text-slate-700"
            >
              {field.label}
            </label>
            {renderField(field)}
            {errors[field.name] ? (
              <p className="mt-1 text-xs text-rose-600">{errors[field.name]}</p>
            ) : null}
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {loading ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
