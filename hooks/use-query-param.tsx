import { useSearchParams } from "next/navigation";
import { DateTime } from "luxon";

export function useQueryParam(key: string, type: "string"): string | undefined;
export function useQueryParam(key: string, type: "string[]"): string[];
export function useQueryParam(key: string, type: "number"): number | undefined;
export function useQueryParam(key: string, type: "date"): Date | undefined;
export function useQueryParam(key: string, type: "boolean"): boolean;
export function useQueryParam(
  key: string,
  type: "string" | "string[]" | "number" | "date" | "boolean"
): string | string[] | number | Date | boolean | undefined {
  const searchParams = useSearchParams();
  const value = searchParams.getAll(key);

  switch (type) {
    case "string":
      return value.length > 0 ? value[0] : undefined;
    case "string[]":
      return value;
    case "number":
      return value.length > 0 ? parseInt(value[0]) : undefined;
    case "date": {
      if (!value[0]) return undefined;
      const date = DateTime.fromISO(value[0]);
      return date.isValid ? new Date(date.toISODate()!) : undefined;
    }
    case "boolean":
      return value.length > 0
        ? ["y", "yes", "true", "1"].includes(value[0].toLowerCase().trim())
        : false;
    default:
      throw new Error(`Unhandled param type: ${type}`);
  }
}
