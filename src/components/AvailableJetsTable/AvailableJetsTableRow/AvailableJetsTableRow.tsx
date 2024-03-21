import React from 'react';
import Jet from '@/interfaces/Jet';

interface AvailableJetsTableRowProps {
    jet: Jet;
    hoveredJetId: number | null;
    setHoveredJetId: React.Dispatch<React.SetStateAction<number | null> >;
    setSelectedJets: React.Dispatch<React.SetStateAction<number[]>>;
}

const AvailableJetsTableRow: React.FC<AvailableJetsTableRowProps> = ({jet, hoveredJetId, setHoveredJetId, setSelectedJets}) => {

    const handleMouseEnter = (jetId: number) => {
        setHoveredJetId(jetId);
    };

    const handleMouseLeave = () => {
        setHoveredJetId(null);
    };

    const handleCheckboxChange = (jetId: number, isChecked: boolean) => {
        setSelectedJets(prevSelectedJets => {
            if (isChecked) {
                return prevSelectedJets.includes(jetId) ? prevSelectedJets : [...prevSelectedJets, jetId];
            } else {
                return prevSelectedJets.filter(id => id !== jetId);
            }
        });
    };

    const toggleCheckbox = (e: React.MouseEvent<HTMLTableRowElement>, jetId: number) => {
        if (e.target === document.getElementById(`checkbox-${jetId}`)) {
            return;
        }

        const checkbox = document.getElementById(`checkbox-${jetId}`) as HTMLInputElement;
        if (checkbox) {
            checkbox.checked = !checkbox.checked;
            handleCheckboxChange(jetId, checkbox.checked);
        }
    };

    return  (<>
        <tr 
                            key={jet.id} 
                            onClick={(e) => toggleCheckbox(e, jet.id)}
                            onMouseEnter={() => handleMouseEnter(jet.id)}
                            onMouseLeave={handleMouseLeave}
                            style={{ backgroundColor: hoveredJetId === jet.id ? '#f2f2f270' : 'transparent' }}
                        >
                            <td>
                                <input 
                                    type="checkbox" 
                                    name={`checkbox-${jet.id}`} 
                                    id={`checkbox-${jet.id}`} 
                                    onChange={(e) => handleCheckboxChange(jet.id, e.target.checked)} 
                                />
                            </td>
                            <td>{jet.name}</td>
                            <td>{jet.wingspan}</td>
                            <td>{jet.engines}</td>
                            <td>{jet.year}</td>
                        </tr>
    
    
    </>)

}

export default AvailableJetsTableRow;