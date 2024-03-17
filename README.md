# Mynth Helper

Library of common utility functions designed to facilitate development.
This repository consolidates reusable code snippets, ensuring
consistency and efficiency in project implementations.

## Installation

To incorporate `mynth-helper` into your project, run the following
command:

``` bash
npm install mynth-helper
```

## Usage

Import and use the helpers in your project as shown in the following
TypeScript example:

``` typescript
import { resolveAdaHandle } from "mynth-helper";

const adaAddress = resolveAdaHandle(blockfrost, policyID, handleName);
```

## Adding New Helpers

Contributing new helper functions is encouraged to enrich the library’s
functionality:

1.  **Add your helper function** to an appropriate existing folder under
    `src/helpers`, or create a new folder for a distinct category of
    helpers.
2.  **Export your helper** in the `src/index.ts` file to make it
    accessible as part of the package.

### Example:

``` typescript
// In your new or existing helper file
export function newHelperFunction(param: ParamType): ReturnType {
  // Implementation
}

// In src/index.ts
export * from './helpers/newHelperFile'; // Adjust the path as necessary
```
