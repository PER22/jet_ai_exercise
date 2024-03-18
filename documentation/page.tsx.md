# CharterJetComparison Component

This is a React component used for comparing different jets based on a selected criterion.

## State Variables

- `jets`: An array of Jet objects.
- `loadingAvailableJets`: A boolean indicating if the component is currently loading available jets.
- `selectedJets`: An array of selected jet IDs for comparison.
- `criterium`: The selected criterium for comparison.
- `loadingComparison`: A boolean indicating if the component is currently loading the comparison results.
- `showComparisonResultsTable`: A boolean indicating if the comparison results table should be displayed.
- `comparisonResults`: An array of Comparison objects representing the results of the comparison.
- `error`: A string representing any error that occurred during the process.

## Functions

- `fetchJetList`: An asynchronous function that fetches the list of available jets from the server.
- `initiateJetComparison`: An asynchronous function that initiates the comparison of selected jets based on the selected criterium.

## Child Components

- `AvailableJetsTable`: A table displaying the available jets.
- `JetComparisonControls`: A set of controls for selecting jets and initiating the comparison.
- `JetComparisonResultsTable`: A table displaying the results of the comparison.

## Usage

This component is used in the application to allow users to compare different jets based on a selected criterion. The comparison results are then displayed in a table.