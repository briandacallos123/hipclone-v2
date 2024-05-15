import type { ReadonlyURLSearchParams } from 'next/navigation';

declare module 'next/navigation' {
  export function useSearchParams(): ReadonlyURLSearchParams | null | any;

  export function usePathname(): string | null | any;

  export function useParams(): Record<string, string | string[]> | null | any;
}
