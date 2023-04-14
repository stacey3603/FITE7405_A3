import { NextPage } from "next";
import OptionSelector, { OptionType } from "../components/optionTypeSelector";
import { useState } from "react";
import InputBox from "../components/inputBox";
import { printBsModel } from "../utils";
import OutputBox from "../components/outputBox";
const EuropeanOption: NextPage = () => {
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
        const q = +parseOption[3];
        const T = +parseOption[4];
        const K = +parseOption[5];
        const price = printBsModel(S, sigma, r, q, T, K, selectedType);
        output.push(price);
      });
      SetOutput(output);
    }
  };
  return (
    <div className="w-screen h-screen flex flex-wrap justify-center content-start">
      <div className="w-full h-[60px] inline-flex text-center mt-10 justify-center">
        <h1 className="w-1/3 text-3xl uppercase">European Option Pricer</h1>
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
            dataDescription="[S(0), σ, r, q, T, K]"
            inputValue={inputValue}
            onInputChange={handleInputChange}
          />
        </div>
      </div>
      <div className=" w-content mt-8 p-4" onClick={calOutput}>
        Run Calculation
      </div>
      <OutputBox output={output} />
    </div>
  );
};

export default EuropeanOption;
