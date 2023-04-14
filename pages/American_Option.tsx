import { NextPage } from "next";
import OptionSelector, { OptionType } from "../components/optionTypeSelector";
import { useState } from "react";
import InputBox from "../components/inputBox";
import { btAmerican } from "../utils";
import OutputBox from "../components/outputBox";
const AmericanOption: NextPage = () => {
  const [selectedType, setSelectedType] = useState<OptionType | undefined>();
  const [inputValue, setInputValue] = useState<string>("");
  const [output, SetOutput] = useState<string[]>([]);

  const handleInputChange = (event: any) => {
    setInputValue(event.target.value);
  };

  const calOutput = () => {
    const optionsArray = inputValue.split(";");
    if (selectedType === undefined) {
      SetOutput(["Please select a option type first"]);
    } else if (optionsArray.length === 0) {
      SetOutput(["Please input option data"]);
    } else {
      const output: string[] = [];
      optionsArray.map((option) => {
        const parseOption = option.slice(1, option.length - 1).split(",");
        const S = +parseOption[0];
        const sigma = +parseOption[1];
        const r = +parseOption[2];
        const T = +parseOption[3];
        const K = +parseOption[4];
        const steps = +parseOption[5];
        const price = btAmerican(S, sigma, r, T, K, steps, selectedType);
        output.push(price);
      });
      SetOutput(output);
    }
  };
  return (
    <div className="w-screen h-screen flex flex-wrap justify-center content-start">
      <div className="w-full h-[60px] inline-flex text-center mt-10 justify-center">
        <h1 className="w-1/3 text-3xl uppercase">American Option Pricer</h1>
      </div>
      <div className="w-full inline-flex  mt-10 shadow-md mx-10 grid grid-cols-2 gap-4">
        <div className="p-[5%] bg-black/20">
          <OptionSelector
            onCallButtonClick={() => setSelectedType(OptionType.CALL)}
            onPutButtonClick={() => setSelectedType(OptionType.PUT)}
            selectedType={selectedType}
          />
        </div>
        <div className="p-[5%] bg-black/20">
          <InputBox
            dataDescription="[S(0), σ, r, T, K, steps]"
            inputValue={inputValue}
            onInputChange={handleInputChange}
          />
        </div>
      </div>
      <button
        className="w-content mt-8 p-4 flex justify-center items-center bg-white text-black"
        onClick={calOutput}
      >
        <p className="w-full">Run Calculation</p>
      </button>
      <OutputBox output={output} loading={false} />
    </div>
  );
};

export default AmericanOption;
