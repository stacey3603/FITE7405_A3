import { NextPage } from "next";
import { useState } from "react";
import InputBox from "../components/inputBox";
import { kikoQMC } from "../utils";
import OutputBox from "../components/outputBox";
const KikoQmc: NextPage = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [output, SetOutput] = useState<string[]>([]);

  const handleInputChange = (event: any) => {
    setInputValue(event.target.value);
  };

  const calOutput = () => {
    const optionsArray = inputValue.split(";");
    if (optionsArray.length === 0) {
      SetOutput(["Please input option data"]);
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
      const L = +parseOption[5];
      const U = +parseOption[6];
      const observations = +parseOption[7];
      const rebate = +parseOption[8];

      const price = kikoQMC(S, sigma, r, T, K, L, U, observations, rebate);
      output.push(price);
    });
    SetOutput(output);
  };
  return (
    <div className="w-screen min-h-max h-full flex flex-wrap justify-center content-start">
      <div className="w-full h-[60px] inline-flex text-center mt-10 justify-center">
        <h1 className="w-1/2 text-3xl uppercase">
          Kiko Put Option Pricer (in Quasi-Monte Carlo)
        </h1>
      </div>
      <div className="w-full inline-flex mt-10 shadow-md mx-10 justify-center">
        <div className="p-[5%] bg-black/20">
          <InputBox
            dataDescription="[S(0), σ, r, T, K, observations, Paths]"
            inputValue={inputValue}
            onInputChange={handleInputChange}
          />
        </div>
      </div>
      <div className=" w-content mt-8 p-4" onClick={calOutput}>
        Run Calculation
      </div>
      <div className="w-full h-[400px] flex justfy-center">
        <OutputBox output={output} />
      </div>
    </div>
  );
};

export default KikoQmc;
