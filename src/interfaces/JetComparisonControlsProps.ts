export default interface JetComparisonControlsProps {
    selectedJets: number[],
    setLoadingComparison: React.Dispatch<React.SetStateAction<boolean>>;
    criterium: string;
    setCriterium: React.Dispatch<React.SetStateAction<string>>
    initiateJetComparison: (ids: number[], criterium: string) => Promise<void>;
  }