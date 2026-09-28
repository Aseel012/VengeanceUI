export type PackageManager = "npm" | "pnpm" | "bun" | "yarn";

// Keep component installation independent of the documentation site's DNS.
// GitHub serves the same versioned files committed under public/r.
export const REGISTRY_BASE_URL =
  "https://raw.githubusercontent.com/Ashutoshx7/VengeanceUI/main/public/r";

export const PACKAGE_MANAGER_EXECUTORS: Record<PackageManager, string> = {
  npm: "npx",
  pnpm: "pnpm dlx",
  bun: "bunx",
  yarn: "yarn dlx",
};

export function getRegistryItemUrl(componentName: string) {
  return `${REGISTRY_BASE_URL}/${componentName}.json`;
}

export function getShadcnAddCommand(componentName: string, packageManager: PackageManager = "npm") {
  return `${PACKAGE_MANAGER_EXECUTORS[packageManager]} shadcn@latest add ${getRegistryItemUrl(componentName)}`;
}

export interface RegistrySourceFile {
  path?: string;
  target?: string;
  content?: string;
}

export function selectRegistryFile(files: RegistrySourceFile[], componentName: string) {
  const expectedName = `${componentName}.tsx`.toLowerCase();
  const exact = files.find((file) =>
    typeof file.content === "string" &&
    [file.target, file.path].some((candidate) => candidate?.toLowerCase().endsWith(expectedName)),
  );

  return exact ?? files.find((file) => typeof file.content === "string");
}

export function selectRegistrySource(files: RegistrySourceFile[], componentName: string) {
  return selectRegistryFile(files, componentName)?.content;
}
