interface SupabaseSchemaError {
  code?: string | null;
  message?: string | null;
  details?: string | null;
  hint?: string | null;
}

const MISSING_SCHEMA_CODES = new Set(["PGRST204", "PGRST205", "42P01", "42703"]);

export function isMissingSupabaseSchemaError(error: unknown, target?: string) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const schemaError = error as SupabaseSchemaError;
  const haystack = [schemaError.message, schemaError.details, schemaError.hint]
    .filter((value): value is string => Boolean(value))
    .join(" ");

  if (schemaError.code && MISSING_SCHEMA_CODES.has(schemaError.code)) {
    return !target || haystack.includes(target);
  }

  if (!target) {
    return false;
  }

  return haystack.includes(target) && /(schema cache|does not exist|Could not find)/i.test(haystack);
}
