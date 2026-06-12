// Allows `tsc --emitDeclarationOnly` to build this package without the Astro
// compiler. Consumers get full prop types from the shipped `.astro` source via
// the Astro language tooling and `astro/client` types.
declare module '*.astro' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Component: (props: Record<string, any>) => any

  // eslint-disable-next-line no-restricted-exports -- .astro modules expose their component as the default export
  export default Component
}
