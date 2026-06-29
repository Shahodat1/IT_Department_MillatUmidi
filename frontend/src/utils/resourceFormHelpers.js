export function getNestedFields(field) {
  if (Array.isArray(field.fields) && field.fields.length > 0) {
    return field.fields;
  }

  if (field.type === "nested_educations") {
    return defaultEducationFields;
  }

  return [];
}

export function createEmptyNestedItem(field) {
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

export function normalizeNestedValue(subField, rawValue) {
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

export function sanitizeNestedItems(items = [], field) {
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

export function resolveFieldOptions(
  fields = [],
  relatedData = {},
  parentPath = "",
) {
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
