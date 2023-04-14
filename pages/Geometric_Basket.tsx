import { NextPage } from "next";
import OptionSelector, { OptionType } from "../components/optionTypeSelector";
import { useState } from "react";
import InputBox from "../components/inputBox";
import { printGeometricBasket } from "../utils";
import OutputBox from "../components/outputBox";
const GeoBasket: NextPage = () => {
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
        const S1 = +parseOption[0];
        const S2 = +parseOption[1];

        const sigma1 = +parseOption[2];
        const sigma2 = +parseOption[3];
        const correlation = +parseOption[4];
        const r = +parseOption[5];
        const T = +parseOption[6];
        const K = +parseOption[7];
        const price = printGeometricBasket(
          S1,
          S2,
          sigma1,
          sigma2,
          correlation,
          r,
          T,
          K,
          selectedType
        );
        output.push(price);
      });
      SetOutput(output);
    }
  };
  return (
    <div className="w-screen h-screen flex flex-wrap justify-center content-start">
      <div className="w-full h-[60px] inline-flex text-center mt-10 justify-center">
        <h1 className="w-1/3 text-3xl uppercase">Geometric Basket Pricer</h1>
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
            dataDescription="[S1(0), S2(0), σ1, σ2 ,correlation, r, T, K]"
            inputValue={inputValue}
            onInputChange={handleInputChange}
          />
        </div>
      </div>
      <button
        className="w-content mt-8 p-4 flex justify-center items-center bg-white text-black"
        onClick={calOutput}
      >
        <p className="w-full"> Run Calculation</p>
      </button>
      <OutputBox output={output} loading={false} />
    </div>
  );
};

export default GeoBasket;
