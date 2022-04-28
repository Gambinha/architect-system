import { useState } from 'react';
import './App.css';
import {
  checkChargeLossPasso11,
  checkIfVelocityIsInLimitPasso5,
  checkUnitaryChargeLossPasso6,
  getExternalDiameterByAbacoPasso4,
  getHigherDiameterPasso4,
  getInternalDiameterPasso4,
  getVazaoPasso3,
  getVelocityPasso5
} from './functions/index';

function App() {
  const [sum, setSum] = useState(0);
  const [sumInput, setSumInput] = useState('');

  const [tubeType, setTubeType] = useState('liso');
  const [cota, setCota] = useState();
  const [previousPression, setPrevousPression] = useState(0);

  const [realLength, setRealLength] = useState();
  const [tubeItensLength, setTubeItensLength] = useState();
  const [itemsChargeLoss, setItemsChargeLoss] = useState(0);

  const [vazao, setVazao] = useState();
  const [internalDiameter, setInternalDiameter] = useState();
  const [externalDiameter, setExternalDiameter] = useState();
  const [velocity, setVelocity] = useState();
  const [unitaryLostCharge, setUnitaryLostCharge] = useState();
  const [availablePression, setAvailablePression] = useState();
  const [lostCharge, setLostCharge] = useState();
  const [eqLength, setEqLength] = useState();
  const [totalLostCharge, setTotalLostCharge] = useState();
  const [availableResidualPression, setAvailableResidualPression] = useState();
  const [allowedPression, setAllowedPression] = useState(false);

  const [showPart1, setShowPart1] = useState(true);
  const [showPart2, setShowPart2] = useState(false);
  const [showPart3, setShowPart3] = useState(false);

  const wantedPression = 5;

  const submitSumValue = (e) => {
    if (e.key === 'Enter') {
      setSum((prev) => prev + Number(e.target.value) );
      setSumInput('');
    }
  }

  const submitFirstPart = () => {
    const vazaoQ = getVazaoPasso3(sum);
    setVazao(vazaoQ);

    let exDiameter = getExternalDiameterByAbacoPasso4(sum);
    let inDiameter = getInternalDiameterPasso4(exDiameter);

    setExternalDiameter(exDiameter);
    setInternalDiameter(inDiameter);

    let velocity = getVelocityPasso5(vazaoQ, inDiameter);
    setVelocity(velocity);
    
    while(!checkIfVelocityIsInLimitPasso5(velocity)) {
      exDiameter = getHigherDiameterPasso4(exDiameter);
      inDiameter = getInternalDiameterPasso4(exDiameter);
      velocity = getVelocityPasso5(vazaoQ, inDiameter);

      setExternalDiameter(exDiameter);
      setInternalDiameter(inDiameter);
      setVelocity(velocity);
    }

    console.log(vazaoQ, inDiameter, tubeType)
    const unitaryLostChargeCurrent = checkUnitaryChargeLossPasso6(vazaoQ, inDiameter, tubeType);
    const availablePressionCurrent = previousPression + (cota * 10);

    setUnitaryLostCharge(unitaryLostChargeCurrent);
    setAvailablePression(availablePressionCurrent);

    setShowPart2(true)
  }

  const submitSecondPart = () => {
    setShowPart1(false);
    setShowPart2(false);

    const eqLengthCurrent = Number(realLength) + Number(tubeItensLength); //comprimento total
    const lostChargeCurrent = checkChargeLossPasso11(unitaryLostCharge, eqLengthCurrent);
    const totalLostChargeCurrent = Number(lostChargeCurrent) + Number(itemsChargeLoss);

    setEqLength(eqLengthCurrent)
    setLostCharge(lostChargeCurrent);
    setTotalLostCharge(totalLostChargeCurrent);

    const availableResidualPressionCurrent = availablePression - totalLostChargeCurrent;
    const allowedPressionCurrent = availableResidualPressionCurrent >= wantedPression ? true : false; 

    setAvailableResidualPression(availableResidualPressionCurrent);
    setAllowedPression(allowedPressionCurrent)

    setShowPart3(true);
  }

  const reset = () => {
    setSum(0)
    setSumInput('')
  
    setTubeType('liso')
    setCota(0)
    setPrevousPression(0)
  
    setRealLength(0)
    setTubeItensLength(0)
    setItemsChargeLoss(0)
  
    setVazao(0)
    setInternalDiameter(0)
    setExternalDiameter(0)
    setVelocity(0)
    setUnitaryLostCharge(0)
    setAvailablePression(0)
    setLostCharge(0)
    setEqLength(0)
    setTotalLostCharge(0)
    setAvailableResidualPression(0)
    setAllowedPression(false);

    setShowPart3(false);
    setShowPart2(false);
    setShowPart1(true)
  }

  return (
    <div className="app">
      <div className="title">
        <h1>PROJETO E DIMENSIONAMENTO DA REDE PREDIAL DE DISTRIBUIÇÃO</h1>
      </div>

      <div className="content">
      { showPart1 &&
        <div className="form1">
          <label htmlFor="sum-items">Pesos para Soma: ({sum})</label>
          <input 
            type="number" 
            name="sum-items" 
            id="sum-items" 
            value={sumInput}
            onChange={(e) => setSumInput(e.target.value)}
            onKeyDown={(event) => submitSumValue(event)} 
          />

          <label htmlFor="tube-type">Tipo de Tubulação:</label>
          <select name="tube-type" id="tube-type" onChange={(e) => setTubeType(e.target.value)} >
            <option value="liso" >Liso</option>
            <option value="rugoso">Rugoso</option>
          </select>

          <label htmlFor="cota">Diferença de Cota: (m)</label>
          <input 
            type="number" 
            name="cota" 
            id="cota" 
            onChange={(e) => setCota(e.target.value)}
          />

          <label htmlFor="pre-pression">Pressão disponível anterior: (Prov. 0)</label>
          <input 
            defaultValue={0}
            type="number" 
            name="number" 
            id="number" 
            onChange={(e) => setPrevousPression(e.target.value)}
          />

          <button className="submitFirstPart" onClick={submitFirstPart}>
            Enviar
          </button>
        </div>
      }

      {showPart2 &&
        <div className="response-container">
          <div className="response">
            <div className="variable">
              <span>Vazão:</span>
              <strong>{vazao.toFixed(2)} l/s</strong>
            </div>

            <div className="variable">
              <span>Diametro Externo:</span>
              <strong>{externalDiameter.toFixed(2)} mm</strong>
            </div>

            <div className="variable">
              <span>Diametro Interno:</span>
              <strong>{internalDiameter.toFixed(2)} mm</strong>
            </div>

            <div className="variable">
              <span>Velocidade Média:</span>
              <strong>{velocity.toFixed(2)} m/s</strong>
            </div>

            <div className="variable">
              <span>Perda de Carga Unitária:</span>
              <strong>{unitaryLostCharge.toFixed(2)} kPa/m</strong>
            </div>

            <div className="variable">
              <span>Pressão Disponível:</span>
              <strong>{availablePression.toFixed(2)} kPa</strong>
            </div>     
          </div>

          <div className="form2">
            <div className="form2-inputs">
              <label htmlFor="realL">Comprimero Real do Trecho: (m)</label>
              <input 
                type="number" 
                name="realL" 
                id="realL" 
                onChange={(e) => setRealLength(e.target.value)}
              />

              <label htmlFor="piecesL">Comprimero de Peças do Trecho: (m)</label>
              <input 
                type="number" 
                name="piecesL" 
                id="piecesL" 
                onChange={(e) => setTubeItensLength(e.target.value)}
              />

              <label htmlFor="registerCharge">Perda de Carga do registro: (Prov. 0)</label>
              <input 
                type="number" 
                name="registerCharge" 
                id="registerCharge" 
                defaultValue={0}
                onChange={(e) => setItemsChargeLoss(e.target.value)}
              />
            </div>

            <button className='end-button' onClick={submitSecondPart} >Finalizar</button>
          </div>

        </div>
      }

      { showPart3 && 
        <div className='answers'>
          <div className="answers-table">
            <div className="column c-1">
              <div className="id">2</div>
              <div className="description">Soma dos Pesos</div>
              <div className="value">{sum}</div>
            </div>

            <div className="column c-1">
              <div className="id">3</div>
              <div className="description">Vazão estimada (l/s)</div>
              <div className="value">{Number(vazao).toFixed(2)}</div>
            </div>

            <div className="column c-2">
              <div className="id">4</div>
              <div className="d-2">
                <div className="d-2-description">
                  Diâmetro (mm)
                </div>

                <div className="d-2-types">
                  <div className="d-2-type">
                    DN
                  </div>
                  <div className="d-2-type">
                    DI
                  </div>
                </div>
              </div>

              <div className="value">
                <div className="value-type">
                  {Number(externalDiameter).toFixed(2)}
                </div>

                <div className="value-type">
                  {Number(internalDiameter).toFixed(2)}
                </div>
              </div>
            </div>

            <div className="column c-1">
              <div className="id">5</div>
              <div className="description">Velocidade (m/s)</div>
              <div className="value">{Number(velocity).toFixed(2)}</div>
            </div>

            <div className="column c-1">
              <div className="id">6</div>
              <div className="description">Perda de carga unitária</div>
              <div className="value">{Number(unitaryLostCharge).toFixed(2)}</div>
            </div>

            <div className="column c-1">
              <div className="id">7</div>
              <div className="description">Diferença de Cota (m)</div>
              <div className="value">{Number(cota).toFixed(2)}</div>
            </div>

            <div className="column c-1">
              <div className="id">8</div>
              <div className="description">Pressão Disponível</div>
              <div className="value">{Number(availablePression).toFixed(2)}</div>
            </div>

            <div className="column c-2">
              <div className="id-2">
                <div className="id-2-type">
                  9
                </div>
                <div className="id-2-type">
                  10
                </div>
              </div>

              <div className="d-2">
                <div className="d-2-description">
                  Comprimento da Tubulação (m)
                </div>

                <div className="d-2-types">
                  <div className="d-2-type">
                    Real
                  </div>
                  <div className="d-2-type">
                    Equiv.
                  </div>
                </div>
              </div>

              <div className="value">
                <div className="value-type">
                  {Number(realLength).toFixed(2)}
                </div>

                <div className="value-type">
                  {Number(eqLength).toFixed(2)}
                </div>
              </div>
            </div>

            <div className="column c-3">
            <div className="id-2">
                <div className="id-2-type">
                  11
                </div>
                <div className="id-2-type">
                  12
                </div>
                <div className="id-2-type">
                  13
                </div>
              </div>

              <div className="d-2">
                <div className="d-2-description">
                  Perda de Carga (kPa)
                </div>

                <div className="d-3-types">
                  <div className="d-3-type">
                    Tubulação
                  </div>
                  <div className="d-3-type">
                    Registro e outros
                  </div>
                  <div className="d-3-type">
                    Total
                  </div>
                </div>
              </div>
              <div className="value">
                <div className="value-type">
                  {Number(lostCharge).toFixed(2)}
                </div>

                <div className="value-type">
                  {Number(itemsChargeLoss).toFixed(2)}
                </div>

                <div className="value-type">
                  {Number(totalLostCharge).toFixed(2)}
                </div>
              </div>
            </div>

            <div className="column c-1">
              <div className="id">14</div>
              <div className="description">Pressão Disponível Residual (kPa)</div>
              <div className="value">{Number(availableResidualPression).toFixed(2)}</div>
            </div>

            <div className="column c-1">
              <div className="id">15</div>
              <div className="description">Pressão Requerida (kPa)</div>
              <div className="value">{wantedPression}</div>
            </div>
          </div>

          { allowedPression ?

            <div className="result r-true">
              <h2>Tudo certin Ana!! Fé. Pressão Residual é maior ou igual à Pressão Requerida</h2>
            </div>

            :

            <div className="result r-false">
              <h2>Deu ruim!! Fé. Pressão Residual é menor que a Pressão Requerida</h2>
            </div>
          }

          <button className='reset' onClick={reset}>Reiniciar</button>
        </ div>
      }

      </div>
    
    </div>
  );
}

export default App;
