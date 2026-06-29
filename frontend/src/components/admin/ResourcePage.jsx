import { useEffect, useMemo, useState } from "react";
import { Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import Topbar from "./Topbar";
import { buildPayload, extractItems, request } from "../../services/adminApi";

function getInitialValues(fields = [], defaults = {}) {
  const values = {};

  fields.forEach((field) => {
    if (defaults[field.name] !== undefined) {
      values[field.name] = defaults[field.name];
      return;
    }

    if (field.type === "checkbox") {
      values[field.name] = false;
      return;
    }

    if (field.type === "file") {
      values[field.name] = null;
      return;
    }

    if (field.type === "nested_educations" || field.type === "nested_section") {
      values[field.name] = [];
      return;
    }

    if (field.name === "tags") {
      values[field.name] = [];
      return;
    }

    values[field.name] = "";
  });

  return values;
}

function getItemId(item) {
  return item?.id ?? item?.pk ?? null;
}

function prettyValue(value) {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

const educationDegreeOptions = [
  { value: "bachelor", label: "Bachelor" },
  { value: "master", label: "Master" },
  { value: "phd", label: "PhD" },
];

const defaultEducationFields = [
  {
    name: "degree",
    label: "Degree",
    type: "select",
    options: educationDegreeOptions,
  },
  { name: "field_of_study", label: "Field of study", type: "text" },
  { name: "institution", label: "Institution", type: "text" },
  { name: "start_year", label: "Start year", type: "number" },
  { name: "end_year", label: "End year", type: "number" },
];

function getNestedFields(field) {
  if (Array.isArray(field.fields) && field.fields.length > 0) {
    return field.fields;
  }

  if (field.type === "nested_educations") {
    return defaultEducationFields;
  }

  return [];
}

function createEmptyNestedItem(field) {
  const nestedFields = getNestedFields(field);
  const item = {};

  nestedFields.forEach((subField) => {
    if (subField.defaultValue !== undefined) {
      item[subField.name] = subField.defaultValue;
      return;
    }

    if (subField.type === "checkbox") {
      item[subField.name] = false;
      return;
    }

    if (subField.type === "file") {
      item[subField.name] = null;
      return;
    }

    item[subField.name] = "";
  });

  return item;
}

function normalizeNestedValue(subField, rawValue) {
  if (subField.type === "file") {
    return rawValue;
  }

  if (subField.type === "checkbox") {
    return Boolean(rawValue);
  }

  if (subField.type === "number") {
    if (rawValue === "" || rawValue === null || rawValue === undefined) {
      return null;
    }

    const parsed = Number(rawValue);
    return Number.isNaN(parsed) ? null : parsed;
  }

  if (rawValue === null || rawValue === undefined) {
    return "";
  }

  if (typeof rawValue === "string") {
    return rawValue.trim();
  }

  return rawValue;
}

function sanitizeNestedItems(items = [], field) {
  const nestedFields = getNestedFields(field);

  return items
    .map((item) => {
      const nextItem = {
        id: item?.id,
      };

      nestedFields.forEach((subField) => {
        nextItem[subField.name] = normalizeNestedValue(
          subField,
          item?.[subField.name],
        );
      });

      return nextItem;
    })
    .filter((item) =>
      Object.values(item).some(
        (value) => value !== null && value !== "" && value !== undefined,
      ),
    );
}

function resolveFieldOptions(fields = [], relatedData = {}, parentPath = "") {
  return fields.map((field) => {
    const fieldPath = parentPath ? `${parentPath}.${field.name}` : field.name;
    const nextField = { ...field };

    if (field.type === "select" && !field.options) {
      nextField.options = relatedData[fieldPath] || [];
    }

    if (field.type === "nested_section" && Array.isArray(field.fields)) {
      nextField.fields = resolveFieldOptions(
        field.fields,
        relatedData,
        fieldPath,
      );
    }

    return nextField;
  });
}

export default function ResourcePage({
  title,
  subtitle,
  endpoint,
  resourceName = "Item",
  fields = [],
  columns = [],
  defaultValues = {},
  emptyMessage,
  selectOptions = {},
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formValues, setFormValues] = useState(
    getInitialValues(fields, defaultValues),
  );
  const [search, setSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [relatedData, setRelatedData] = useState({});
  const [createdItem, setCreatedItem] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await request(`${endpoint}?page=${currentPage}`);
      setItems(extractItems(data));

      setTotalCount(data.count || 0);
      setNextPage(data.next);
      setPreviousPage(data.previous);
    } catch (err) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [endpoint, currentPage]);

  useEffect(() => {
    const loadSelectOptions = async () => {
      const entries = Object.entries(selectOptions || {});
      if (entries.length === 0) return;

      try {
        const results = await Promise.all(
          entries.map(async ([fieldPath, cfg]) => {
            const payload = await request(cfg.endpoint);
            const list = extractItems(payload);

            const options = list.map((item) => {
              const value = cfg.valueKey ? item[cfg.valueKey] : item.id;
              const label = cfg.labelFn
                ? cfg.labelFn(item)
                : cfg.labelKey
                  ? item[cfg.labelKey]
                  : item.name || item.title || `#${item.id}`;

              return { value, label };
            });

            return [fieldPath, options];
          }),
        );

        setRelatedData(Object.fromEntries(results));
      } catch (err) {
        console.error("Failed to load select options:", err);
      }
    };

    loadSelectOptions();
  }, [selectOptions]);

  const resolvedFields = useMemo(() => {
    return resolveFieldOptions(fields, relatedData);
  }, [fields, relatedData]);

  const filteredItems = useMemo(() => {
    if (!search.trim()) return items;
    const term = search.toLowerCase();

    return items.filter((item) =>
      Object.values(item).some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(term),
      ),
    );
  }, [items, search]);

  const openCreate = () => {
    setError("");
    setCreatedItem(null);
    setCurrentItem(null);
    setFormValues(getInitialValues(fields, defaultValues));
    setFormOpen(true);
  };

  const openEdit = (item) => {
    console.log("OPEN EDIT");
    console.log(item.office_hours);
    console.log(item.educations);

    setError("");
    setCreatedItem(null);
    setCurrentItem(item);

    const normalizedItem = {
      ...item,
      head: item.head?.id || "",

      grading_criteria: (item.grading_criteria || []).map((g) => ({
        id: Number(g.id),
        title: g.title,
        score: g.score,
      })),
    };

    setFormValues(
      getInitialValues(fields, {
        ...defaultValues,
        ...normalizedItem,
      }),
    );

    setFormOpen(true);
  };

  const openDelete = (item) => {
    setError("");
    setCurrentItem(item);
    setDeleteOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setSubmitting(false);
  };

  const closeDelete = () => {
    setDeleteOpen(false);
    setDeleting(false);
  };

  const handleChange = (name, value) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      setCreatedItem(null);

      const id = getItemId(currentItem);
      const isEdit = Boolean(id);

      const submitValues = {
        ...formValues,
      };

      fields.forEach((field) => {
        if (
          field.type === "nested_educations" ||
          field.type === "nested_section"
        ) {
          submitValues[field.name] = sanitizeNestedItems(
            submitValues[field.name],
            field,
          );
        }
      });

      if (submitValues.grading_criteria) {
        submitValues.grading_criteria = submitValues.grading_criteria.map(
          (item) => ({
            ...(item.id ? { id: Number(item.id) } : {}),
            title: item.title,
            score: Number(item.score),
          }),
        );
      }

      console.log(
        "GRADING SUBMIT",
        JSON.stringify(submitValues.grading_criteria, null, 2),
      );

      const payload = buildPayload(submitValues, fields);

      console.log("IS FORM DATA", payload instanceof FormData);
      const isFormData = payload instanceof FormData;

      let responseData = null;

      if (isEdit) {
        responseData = await request(`${endpoint}${id}/`, {
          method: "PATCH",
          data: payload,
          isFormData,
        });
      } else {
        responseData = await request(endpoint, {
          method: "POST",
          data: payload,
          isFormData,
        });
        setCreatedItem(responseData);
      }

      closeForm();
      await loadData();
    } catch (err) {
      setError(err.message || "Save failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      setError("");

      const id = getItemId(currentItem);
      if (!id) throw new Error("Item id not found");

      await request(`${endpoint}${id}/`, {
        method: "DELETE",
      });

      closeDelete();
      await loadData();
    } catch (err) {
      setError(err.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const renderNestedSection = (field) => {
    const value = formValues[field.name];
    const nestedFields = getNestedFields(field);
    const itemsValue = Array.isArray(value) ? value : [];

    const baseClass =
      "mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-800";

    const updateNestedItem = (index, key, nextValue) => {
      const nextItems = itemsValue.map((item, currentIndex) =>
        currentIndex === index ? { ...item, [key]: nextValue } : item,
      );
      handleChange(field.name, nextItems);
    };

    const addNestedItem = () => {
      handleChange(field.name, [...itemsValue, createEmptyNestedItem(field)]);
    };

    const removeNestedItem = (index) => {
      handleChange(
        field.name,
        itemsValue.filter((_, currentIndex) => currentIndex !== index),
      );
    };

    const renderNestedInput = (subField, subValue, onChange) => {
      if (subField.type === "textarea") {
        return (
          <textarea
            className={`${baseClass} min-h-28`}
            rows={subField.rows || 4}
            value={subValue ?? ""}
            placeholder={subField.placeholder || ""}
            onChange={(e) => onChange(e.target.value)}
          />
        );
      }

      if (subField.type === "select") {
        return (
          <select
            className={baseClass}
            value={subValue ?? ""}
            onChange={(e) => onChange(e.target.value)}
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

      if (subField.type === "file") {
        return (
          <div className="space-y-2">
            <input
              className={baseClass}
              type="file"
              accept={subField.accept || "*/*"}
              onChange={(e) => onChange(e.target.files?.[0] || null)}
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
              <p className="text-xs text-slate-500">
                Selected: {subValue.name}
              </p>
            ) : null}
          </div>
        );
      }

      if (subField.type === "checkbox") {
        return (
          <label className="mt-2 flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={Boolean(subValue)}
              onChange={(e) => onChange(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300"
            />
            {subField.checkboxLabel || subField.label}
          </label>
        );
      }

      return (
        <input
          className={baseClass}
          type={subField.type || "text"}
          placeholder={subField.placeholder || ""}
          value={subValue ?? ""}
          onChange={(e) => onChange(e.target.value)}
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
            {field.helperText ? (
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {field.helperText}
              </p>
            ) : null}
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
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                    {field.itemLabel || field.label} #{index + 1}
                  </h4>

                  <button
                    type="button"
                    onClick={() => removeNestedItem(index)}
                    className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50 dark:border-rose-900 dark:bg-slate-950 dark:text-rose-400 dark:hover:bg-rose-950/40"
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
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {subField.label}
                        </label>
                        {renderNestedInput(subField, subValue, (nextValue) =>
                          updateNestedItem(index, subField.name, nextValue),
                        )}
                        {subField.helperText ? (
                          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                            {subField.helperText}
                          </p>
                        ) : null}
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
  };

  const renderField = (field) => {
    const value = formValues[field.name];

    const baseClass =
      "mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-800";

    if (field.type === "nested_educations" || field.type === "nested_section") {
      return renderNestedSection(field);
    }

    if (field.type === "textarea") {
      const textareaValue =
        field.name === "tags" && Array.isArray(value)
          ? value.join(", ")
          : (value ?? "");

      return (
        <textarea
          className={`${baseClass} min-h-28`}
          rows={field.rows || 4}
          value={textareaValue}
          placeholder={field.placeholder || ""}
          onChange={(e) => handleChange(field.name, e.target.value)}
        />
      );
    }

    if (field.type === "select") {
      return (
        <select
          className={baseClass}
          value={value ?? ""}
          onChange={(e) => handleChange(field.name, e.target.value)}
        >
          <option value="">Select...</option>
          {(field.options || []).map((option) => (
            <option key={String(option.value)} value={option.value}>
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
            className={baseClass}
            type="file"
            accept={field.accept || "*/*"}
            onChange={(e) =>
              handleChange(field.name, e.target.files?.[0] || null)
            }
          />

          {typeof value === "string" && value ? (
            field.accept?.includes("image") ? (
              <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
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
                className="inline-flex items-center gap-2 text-sm text-blue-600 underline"
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
        <label className="mt-2 flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => handleChange(field.name, e.target.checked)}
            className="h-4 w-4 rounded border-slate-300"
          />
          {field.checkboxLabel || field.label}
        </label>
      );
    }

    return (
      <input
        className={baseClass}
        type={field.type || "text"}
        placeholder={field.placeholder || ""}
        value={value ?? ""}
        onChange={(e) => handleChange(field.name, e.target.value)}
      />
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Topbar
        title={title}
        subtitle={subtitle}
        onAdd={openCreate}
        addLabel={`Add ${resourceName}`}
      />

      <div className="p-6">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${resourceName.toLowerCase()}...`}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 md:max-w-md"
          />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Current page total:{" "}
            <span className="font-semibold text-slate-900 dark:text-white">
              {filteredItems.length}
            </span>
          </p>
        </div>

        {error ? (
          <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-300">
            {error}
          </div>
        ) : null}

        {createdItem && !currentItem ? (
          <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300">
            <p className="font-semibold">Successfully created.</p>

            {createdItem.user_username ? (
              <p className="mt-2">
                Username:{" "}
                <span className="font-medium">{createdItem.user_username}</span>
              </p>
            ) : null}

            {createdItem.temporary_password ? (
              <p className="mt-1">
                Temporary password:{" "}
                <span className="font-mono font-semibold">
                  {createdItem.temporary_password}
                </span>
              </p>
            ) : null}
          </div>
        ) : null}

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-slate-500 dark:text-slate-400">
              <Loader2 className="mr-2 animate-spin" size={18} />
              Loading...
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="py-16 text-center text-slate-500 dark:text-slate-400">
              {emptyMessage || `No ${resourceName.toLowerCase()} found`}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                <thead className="bg-slate-50 dark:bg-slate-950/60">
                  <tr>
                    {columns.map((column) => (
                      <th
                        key={column.key}
                        className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                      >
                        {column.label}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 bg-white dark:divide-slate-800 dark:bg-slate-900">
                  {filteredItems.map((item) => {
                    return (
                      <tr
                        key={getItemId(item) || JSON.stringify(item)}
                        className="hover:bg-slate-50 dark:hover:bg-slate-900/60"
                      >
                        {columns.map((column) => {
                          const rendered = column.render
                            ? column.render(item)
                            : item[column.key];
                          return (
                            <td
                              key={column.key}
                              className="px-4 py-4 text-sm text-slate-700 dark:text-slate-200"
                            >
                              {typeof rendered === "string" ||
                              typeof rendered === "number" ||
                              typeof rendered === "boolean"
                                ? prettyValue(rendered)
                                : rendered || "-"}
                            </td>
                          );
                        })}

                        <td className="px-4 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openEdit(item)}
                              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                            >
                              <Pencil size={15} />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => openDelete(item)}
                              className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50 dark:border-rose-900 dark:bg-slate-900 dark:text-rose-400 dark:hover:bg-rose-950/40"
                            >
                              <Trash2 size={15} />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="mt-8 flex items-center justify-between border-t py-6  px-10">
                <p className="text-sm text-slate-500">
                  All courses total: {totalCount}
                </p>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={!previousPage}
                    onClick={() => setCurrentPage((page) => page - 1)}
                    className="rounded-xl border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>

                  <span className="font-medium">Page {currentPage}</span>

                  <button
                    type="button"
                    disabled={!nextPage}
                    onClick={() => setCurrentPage((page) => page + 1)}
                    className="rounded-xl border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {formOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {currentItem ? `Edit ${resourceName}` : `Add ${resourceName}`}
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Fill in the details below
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
                aria-label="Close form"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="max-h-[75vh] overflow-y-auto pr-1"
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {resolvedFields.map((field) => (
                  <div
                    key={field.name}
                    className={field.fullWidth ? "md:col-span-2" : ""}
                  >
                    <label
                      htmlFor={field.name}
                      className="text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      {field.label}
                    </label>
                    {renderField(field)}
                    {field.helperText ? (
                      <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                        {field.helperText}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                >
                  {submitting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Plus size={16} />
                  )}
                  {submitting ? "Saving..." : currentItem ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {deleteOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              Delete {resourceName}
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Are you sure you want to delete this item? This action cannot be
              undone.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closeDelete}
                className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="rounded-2xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
