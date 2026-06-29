import { Plus, Trash2 } from "lucide-react";

export default function NestedSection({
  field,
  value = [],
  onChange,
  getNestedFields,
  createEmptyNestedItem,
}) {
  const nestedFields = getNestedFields(field);

  const itemsValue = Array.isArray(value) ? value : [];

  const baseClass =
    "mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-800";

  const updateNestedItem = (index, key, nextValue) => {
    const nextItems = itemsValue.map((item, currentIndex) =>
      currentIndex === index
        ? {
            ...item,
            [key]: nextValue,
          }
        : item,
    );

    onChange(nextItems);
  };

  const addNestedItem = () => {
    onChange([...itemsValue, createEmptyNestedItem(field)]);
  };

  const removeNestedItem = (index) => {
    onChange(itemsValue.filter((_, currentIndex) => currentIndex !== index));
  };

  const renderNestedInput = (subField, subValue, onValueChange) => {
    // ==========================
    // TEXTAREA
    // ==========================

    if (subField.type === "textarea") {
      return (
        <textarea
          className={`${baseClass} min-h-28`}
          rows={subField.rows || 4}
          value={subValue ?? ""}
          placeholder={subField.placeholder || ""}
          onChange={(e) => onValueChange(e.target.value)}
        />
      );
    }

    // ==========================
    // SELECT
    // ==========================

    if (subField.type === "select") {
      return (
        <select
          className={baseClass}
          value={subValue ?? ""}
          onChange={(e) => onValueChange(e.target.value)}
        >
          <option value="">Select...</option>

          {(subField.options || []).map((option) => (
            <option key={String(option.value)} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    // ==========================
    // FILE
    // ==========================

    if (subField.type === "file") {
      return (
        <div className="space-y-2">
          <input
            className={baseClass}
            type="file"
            accept={subField.accept || "*/*"}
            onChange={(e) => onValueChange(e.target.files?.[0] || null)}
          />

          {typeof subValue === "string" && subValue ? (
            <a
              href={subValue}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-blue-600 underline"
            >
              Current File
            </a>
          ) : subValue instanceof File ? (
            <p className="text-xs text-slate-500">Selected: {subValue.name}</p>
          ) : null}
        </div>
      );
    }

    // ==========================
    // CHECKBOX
    // ==========================

    if (subField.type === "checkbox") {
      return (
        <label className="mt-2 flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            checked={Boolean(subValue)}
            onChange={(e) => onValueChange(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300"
          />

          {subField.checkboxLabel || subField.label}
        </label>
      );
    }

    // ==========================
    // DEFAULT
    // ==========================

    return (
      <input
        className={baseClass}
        type={subField.type || "text"}
        placeholder={subField.placeholder || ""}
        value={subValue ?? ""}
        onChange={(e) => onValueChange(e.target.value)}
      />
    );
  };

  return (
    <div className="mt-1 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            {field.label}
          </p>

          {field.helperText && (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {field.helperText}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={addNestedItem}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
        >
          <Plus size={16} />
          Add {field.itemLabel || field.label}
        </button>
      </div>

      <div className="space-y-4">
        {itemsValue.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
            No {field.label.toLowerCase()} added yet.
          </div>
        ) : (
          itemsValue.map((item, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {field.itemLabel || field.label} #{index + 1}
                </h4>

                <button
                  type="button"
                  onClick={() => removeNestedItem(index)}
                  className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:border-rose-900 dark:bg-slate-950 dark:text-rose-400"
                >
                  <Trash2 size={15} />
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {nestedFields.map((subField) => {
                  const subValue = item?.[subField.name];

                  return (
                    <div
                      key={subField.name}
                      className={subField.fullWidth ? "md:col-span-2" : ""}
                    >
                      {subField.type !== "checkbox" && (
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {subField.label}
                        </label>
                      )}

                      {renderNestedInput(subField, subValue, (nextValue) =>
                        updateNestedItem(index, subField.name, nextValue),
                      )}

                      {subField.helperText && (
                        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                          {subField.helperText}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
