import React, { useState, createContext, useContext } from 'react'


const TutorialProvider = createContext({})


export const useTutorialProvider = () => {
    return useContext(TutorialProvider)
}

const Tutorialstep = ({children}:any) => {

    const [currentStep, setCurrentStep] = useState()

  return (
    <TutorialProvider.Provider value={{currentStep, setCurrentStep}}>
        {children}
    </TutorialProvider.Provider>
  )
}

export default Tutorialstep