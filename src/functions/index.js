const getVazaoPasso3 = (value) => {
    return 0.3 * Math.sqrt(value);
}

const getExternalDiameterByAbacoPasso4 = (value) => {
    return value < 1.1 ? 20 : 
           value < 3.5 ? 25 :
           value < 18  ? 32 :
           value < 44  ? 40 :   
           value < 100 ? 50 :
           60;
}

const getInternalDiameterPasso4 = (value) => {
    return value === 20 ? 17 : 
           value === 25 ? 21.6 :
           value === 32 ? 27.8 :
           value === 40 ? 35.2 :
           value === 50 ? 44 :
           value === 60 ? 53.4 :
           value === 75 ? 66.6 :
           value === 85 ? 75.6 :
           value === 110 ? 97.8 :
           null;
}

const getHigherDiameterPasso4 = (value) => {
    return value === 20 ? 25 : 
           value === 25 ? 32 :
           value === 32 ? 40 :
           value === 40 ? 50 :
           value === 50 ? 60 :
           75;
}

const getVelocityPasso5 = (vazao, diameter) => {
    return (4000 * vazao) / (Math.PI * Math.pow(diameter, 2));
}

const checkIfVelocityIsInLimitPasso5 = (value) => {
    return value <= 3 ? true : false;
}

const checkUnitaryChargeLossPasso6 = (vazao, diameter, tubeType) => {
    return tubeType === "liso" ?
           (8.69 * Math.pow(10, 6) * Math.pow(vazao, 1.75)) / Math.pow(diameter, 4.75) : 
           (20.2 * Math.pow(10, 6) * Math.pow(vazao, 1.88)) / Math.pow(diameter, 4.88);
}

const checkChargeLossPasso11 = (unitaryChargeLoss, eqLength) => {
    return unitaryChargeLoss * eqLength;
}

export { 
    checkChargeLossPasso11, 
    checkIfVelocityIsInLimitPasso5, 
    checkUnitaryChargeLossPasso6, 
    getExternalDiameterByAbacoPasso4,
    getHigherDiameterPasso4,
    getInternalDiameterPasso4,
    getVazaoPasso3,
    getVelocityPasso5,
};
