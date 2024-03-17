import React from 'react';

import JetComparisonControlsProps from '@/interfaces/JetComparisonControlsProps';

const JetComparisonControls: React.FC<JetComparisonControlsProps> = ({ selectedJets, setLoadingComparison, criterium, setCriterium, initiateJetComparison }) => {

    const handleCompareButtonClick = async () => {
        setLoadingComparison(true);
        try {
            const comparisonResults = await initiateJetComparison(selectedJets, criterium);
        } catch (error) {
            console.error("Error comparing jets:", error);
        } finally {
            setLoadingComparison(false);
        }
    };

    return (
        <div id="comparison-controls">
            <label>
                Compare selected jets by:
            </label>
            <div id="comparison-options" onChange={e => {
                const target = e.target as HTMLInputElement;
                setCriterium(target.value)
            }}>
                <label>
                    <input type="radio" name="comparison" value="top speed (Mach)" defaultChecked />
                    Top Speed
                </label>
                <label>
                    <input type="radio" name="comparison" value="fuel efficiency" />
                    Fuel Efficiency
                </label>
                <label>
                    <input type="radio" name="comparison" value="standard number of seats" />
                    Maximum Seats
                </label>
            </div>
            <button id="compare-btn" onClick={handleCompareButtonClick}>Compare Selected Jets</button>
        </div>
    );
};
export default JetComparisonControls;
