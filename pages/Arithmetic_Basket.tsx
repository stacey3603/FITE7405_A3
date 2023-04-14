import { NextPage } from "next";
import OptionSelector, { OptionType } from "../components/optionTypeSelector";
import { useState } from "react";
import InputBox from "../components/inputBox";
import { monteCarloBasket } from "../utils";
import OutputBox from "../components/outputBox";
import ControlSelector, { ControlType } from "../components/controlSelector";

const testCase =
  "[100, 100, 0.3, 0.3, 0.5, 0.05, 3, 100, 100000];[100, 100, 0.3, 0.3, 0.9, 0.05, 3, 100, 100000];[100, 100, 0.1, 0.3, 0.5, 0.05, 3, 100, 100000];[100, 100, 0.3, 0.3, 0.5, 0.05, 3, 80, 100000];[100, 100, 0.3, 0.3, 0.5, 0.05, 3, 120, 100000];[100, 100, 0.5, 0.5, 0.5, 0.05, 3, 100, 100000]";
const ArithBasket: NextPage = () => {
  const [selectedType, setSelectedType] = useState<OptionType | undefined>();
  const [control, setControl] = useState<ControlType | undefined>(undefined);
  const [inputValue, setInputValue] = useState<string>("");
  const [output, SetOutput] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleInputChange = (event: any) => {
    setInputValue(event.target.value);
  };

  const calOutput = async (inputValue: string) => {
    const optionsArray = inputValue.split(";");
    if (selectedType === undefined) {
      SetOutput(["Please select a option type first"]);
      setLoading(false);
      return;
    }
    if (optionsArray.length === 1) {
      SetOutput(["Please input option data"]);
      setLoading(false);
      return;
    }
    if (control === undefined) {
      SetOutput(["Please select a control type first"]);
      setLoading(false);
      return;
    }
    const waitOutput = async () => {
      const output: string[] = [];
      for (let i = 0; i < optionsArray.length; i++) {
        const option = optionsArray[i];
        const parseOption = option.slice(1, option.length - 1).split(",");
        const S1 = +parseOption[0];
        const S2 = +parseOption[1];
        const sigma1 = +parseOption[2];
        const sigma2 = +parseOption[3];
        const correlation = +parseOption[4];
        const r = +parseOption[5];
        const T = +parseOption[6];
        const K = +parseOption[7];
        const path = +parseOption[8];
        const price = monteCarloBasket(
          S1,
          S2,
          sigma1,
          sigma2,
          correlation,
          r,
          T,
          K,
          selectedType,
          path,
          control === ControlType.True ? true : false
        );
        output.push(price);
      }
      return Promise.resolve(output);
    };
    const output = await waitOutput();
    SetOutput(output);
  };

  return (
    <div className="w-screen min-h-max h-full flex flex-wrap justify-center content-start">
      <div className="w-full h-[60px] inline-flex text-center mt-10 justify-center">
        <h1 className="w-1/3 text-3xl uppercase">
          Arithmetic Basket Pricer(in Monte Carlo)
        </h1>
      </div>
      <div className="w-full inline-flex mt-10 shadow-md mx-10 grid grid-cols-2 gap-4">
        <div className="w-full grid grid-cols-2 gap-2 p-[5%] bg-black/20">
          <OptionSelector
            onCallButtonClick={() => setSelectedType(OptionType.CALL)}
            onPutButtonClick={() => setSelectedType(OptionType.PUT)}
            selectedType={selectedType}
          />
          <ControlSelector
            onTrueButtonClick={() => setControl(ControlType.True)}
            onFalseButtonClick={() => setControl(ControlType.False)}
            selectedType={control}
          />
        </div>
        <div className="p-[5%] bg-black/20">
          <InputBox
            dataDescription="[S1(0), S2(0), σ1, σ2, correlation, r, T, K, Paths]"
            inputValue={inputValue}
            onInputChange={handleInputChange}
          />
        </div>
      </div>
      <button
        className="w-content mt-8 p-4 mr-4 flex justify-center items-center bg-white text-black"
        onClick={() => calOutput(inputValue)}
      >
        <p className="w-full">Run Calculation</p>
      </button>
      <button
        className="w-content mt-8 p-4 ml-4 flex justify-center items-center bg-white text-black"
        onClick={async () => {
          setLoading(true);
          await calOutput(testCase);
          setLoading(false);
        }}
      >
        <p className="w-full">Run Test Cases</p>
      </button>
      <div className="w-full h-[400px] flex justfy-center">
        <OutputBox output={output} loading={loading} />
      </div>
    </div>
  );
};

export default ArithBasket;
