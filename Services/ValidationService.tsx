export const handleValidation = (actionType: string, inputName: string, errorMessages: string[], setErrorArray: (value: string[] | []) => void) => {
    if(actionType === 'add') {
        let errorArray = errorMessages;
        errorArray.push(inputName);
        setErrorArray(errorArray);
    } else {
        let errorArray = errorMessages.filter((e: string) => e !== inputName );
        setErrorArray(errorArray);
    }
};