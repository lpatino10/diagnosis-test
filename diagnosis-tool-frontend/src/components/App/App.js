import React, { useEffect, useState } from 'react';
import './App.scss';
import '../SymptomSelect/SymptomSelect';
import { SymptomSelect } from '../SymptomSelect/SymptomSelect';
import { DiagnosisGuess } from '../DiagnosisGuess/DiagnosisGuess';
import { DiagnosisSelect } from '../DiagnosisSelect/DiagnosisSelect';
import { DiagnosisComparison } from '../DiagnosisComparison/DiagnosisComparison';
import { getApiBaseEndpoint, urlNameToDisplayName } from '../../utils';

const SYMPTOM_SELECT_SECTION = 'symptomSelect';
const DIAGNOSIS_GUESS_SECTION = 'diagnosisGuess';
const DIAGNOSIS_SELECT_SECTION = 'diagnosisSelect';
const DIAGNOSIS_COMPARISON_SECTION = 'diagnosisComparisonSection';

const updateDiagnosisSelectionCount = async (diagnosis, symptom) => {
  const updateDiagnosisSelectionCountEndpoint = `${getApiBaseEndpoint()}/diagnosis`;
  const body = {
    name: diagnosis,
    symptom: urlNameToDisplayName(symptom),
  };

  await fetch(updateDiagnosisSelectionCountEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
};

function App() {
  const [section, setSection] = useState(SYMPTOM_SELECT_SECTION);
  const [symptom, setSymptom] = useState('');
  const [diagnosisGuess, setDiagnosisGuess] = useState('');

  useEffect(() => {
    if (symptom !== '') {
      setSection(DIAGNOSIS_GUESS_SECTION);
    }
  }, [symptom]);

  const onDiagnosisGuessConfirmation = (guessResult) => {
    setDiagnosisGuess(guessResult.guess);
    if (guessResult.wasCorrect) {
      updateDiagnosisSelectionCount(guessResult.guess, symptom)
        .then(() => {
          setSection(DIAGNOSIS_COMPARISON_SECTION);
        });
    } else {
      setSection(DIAGNOSIS_SELECT_SECTION);
    }
  };

  const onUserSelectDiagnosis = (diagnosis) => {
    updateDiagnosisSelectionCount(diagnosis, symptom)
      .then(() => {
        setSection(DIAGNOSIS_COMPARISON_SECTION);
      });
  };

  let sectionToRender = null;
  switch (section) {
    case DIAGNOSIS_GUESS_SECTION:
      sectionToRender =
        <DiagnosisGuess
          symptom={symptom}
          onGuessConfirmation={onDiagnosisGuessConfirmation}
        />;
      break;
    case DIAGNOSIS_SELECT_SECTION:
      sectionToRender =
        <DiagnosisSelect
          symptom={symptom}
          diagnosisGuess={diagnosisGuess}
          onSelect={onUserSelectDiagnosis}
        />;
      break;
    case DIAGNOSIS_COMPARISON_SECTION:
      sectionToRender =
        <DiagnosisComparison
          symptom={symptom}
          onRestartButtonClick={() => setSection(SYMPTOM_SELECT_SECTION)}
        />;
      break;
    case SYMPTOM_SELECT_SECTION:
    default:
      sectionToRender = <SymptomSelect onSelect={((symptom) => setSymptom(symptom))} />;
  }

  return (
    <div className="app">
      <div className="app-wrapper">
        <h1 className="title">Diagnosis tool</h1>
        {sectionToRender}
      </div>
    </div>
  );
}

export default App;
