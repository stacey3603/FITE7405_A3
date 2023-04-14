import { NextPage } from "next";
import OptionSelector, { OptionType } from "../components/optionTypeSelector";
import { useState } from "react";
import InputBox from "../components/inputBox";
import { monteCarloAsian } from "../utils";
import OutputBox from "../components/outputBox";
import ControlSelector, { ControlType } from "../components/controlSelector";

const testCase =
  "[100, 0.3, 0.05, 3, 100, 50, 100000];[100, 0.3, 0.05, 3, 100, 100, 100000];[100, 0.4, 0.05, 3, 100, 50, 100000]";

const ArithAsian: NextPage = () => {
  const [selectedType, setSelectedType] = useState<OptionType | undefined>();
  const [control, setControl] = useState<ControlType | undefined>(undefined);
  const [inputValue, setInputValue] = useState<string>("");
  const [output, SetOutput] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const handleInputChange = (event: any) => {
    setInputValue(event.target.value);
  };

  const calOutput = (inputValue: string) => {
    setLoading(true);
    const optionsArray = inputValue.split(";");
    if (selectedType === undefined) {
      SetOutput(["Please select a option type first"]);
      setLoading(false);

      return;
    }
    if (optionsArray.length === 0) {
      SetOutput(["Please input option data"]);
      setLoading(false);
      return;
    }
    if (control === undefined) {
      SetOutput(["Please select a control type first"]);
      setLoading(false);
      return;
    }

    const output: string[] = [];
    optionsArray.map((option) => {
      const parseOption = option.slice(1, option.length - 1).split(",");
      const S = +parseOption[0];
      const sigma = +parseOption[1];
      const r = +parseOption[2];
      const T = +parseOption[3];
      const K = +parseOption[4];
      const observations = +parseOption[5];
      const path = +parseOption[6];

      const price = monteCarloAsian(
        S,
        sigma,
        r,
        T,
        K,
        observations,
        selectedType,
        path,
        control === ControlType.True ? true : false
      );
      output.push(price);
    });
    SetOutput(output);
    setLoading(false);
  };
  return (
    <div className="w-screen min-h-max h-full flex flex-wrap justify-center content-start">
      <div className="w-full h-[60px] inline-flex text-center mt-10 justify-center">
        <h1 className="w-1/3 text-3xl uppercase">
          Arithmetic Asian Pricer(in Monte Carlo)
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
            dataDescription="[S(0), σ, r, T, K, observations, Paths]"
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
        onClick={() => {
          calOutput(testCase);
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

export default ArithAsian;
