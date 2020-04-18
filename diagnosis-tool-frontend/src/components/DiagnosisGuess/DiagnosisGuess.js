import React, { useEffect, useState } from 'react';
import useDataApi from 'use-data-api';
import { ButtonSelection } from '../ButtonSelection/ButtonSelection';
import { getApiBaseEndpoint } from '../../utils';

const pickRandomDiagnosisWithHighestCount = (diagnosisList) => {
  if (diagnosisList.length === 0) {
    return '';
  }

  const hightestCount = diagnosisList[0].selection_count;
  let numberOfTies = 0;
  for (let i = 0; i < diagnosisList.length && diagnosisList[i].selection_count === hightestCount; i++) {
    numberOfTies++;
  }
  const randomIndex = Math.floor(Math.random() * Math.floor(numberOfTies));
  return diagnosisList[randomIndex].name;
};

const renderGuessSection = (guess, onButtonSelect) => {
  const buttonData = [
    {
      label: 'Yes',
      value: 'yes',
    },
    {
      label: 'No',
      value: 'no',
    },
  ];

  return (
    <>
      <p>It looks like your most likely diagnosis is: <b>{guess}</b></p>
      <p>Do you agree?</p>
      <ButtonSelection buttonData={buttonData} onSelect={onButtonSelect} />
    </>
  )
};

export const DiagnosisGuess = ({ symptom, onGuessConfirmation }) => {
  const diagnosesBySelectionCountEndpoint = `${getApiBaseEndpoint()}/symptoms/${symptom}/diagnoses`;

  const [guess, setGuess] = useState('');

  const [{ data, isLoading, isError }, doFetch] = useDataApi(diagnosesBySelectionCountEndpoint, []);

  useEffect(() => {
    doFetch(diagnosesBySelectionCountEndpoint);
    setGuess(pickRandomDiagnosisWithHighestCount(data));
  }, [data, doFetch, isError, isLoading, diagnosesBySelectionCountEndpoint]);

  const onButtonSelect = (value) => {
    const result = {
      guess: guess,
      wasCorrect: value === 'yes',
    };
    onGuessConfirmation(result);
  };

  return (
    <div className="diagnosis-guess">
      {isLoading
        ? <p>Determining best diagnosis...</p>
        : renderGuessSection(guess, onButtonSelect)
      }
    </div>
  );
};
