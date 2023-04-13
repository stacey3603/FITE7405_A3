import { useState } from "react";

export enum OptionType {
  CALL = "Call",
  PUT = "Put",
}

interface Iprops {
  onCallButtonClick: () => void;
  onPutButtonClick: () => void;
  selectedType: OptionType | undefined;
}
export default function OptionSelector(props: Iprops) {
  const [showSelector, setShowSelector] = useState(false);

  return (
    <div className="mt-4 flex flex-wrap">
      <div className="relative">
        <button
          className="w-content h-10 p-4 flex justify-center items-center bg-white text-black"
          onClick={() => {
            setShowSelector((prev) => !prev);
          }}
        >
          <p className="w-full">Please chose your option type</p>
        </button>
        <div
          className={`w-[80px] text-center flex-wrap absolute top-[50px] left-0 text-black bg-white ${
            showSelector ? "flex" : "hidden"
          }`}
        >
          <span
            className="w-full border border-black"
            onClick={() => {
              props.onCallButtonClick();
              setShowSelector(false);
            }}
          >
            Call
          </span>
          <span
            className="w-full border border-black"
            onClick={() => {
              props.onPutButtonClick();
              setShowSelector(false);
            }}
          >
            Put
          </span>
        </div>
      </div>
      <div className="w-full h-6 mt-40 flex text-center text-gray relative">
        Option Type: {props.selectedType ?? "--"}
      </div>
    </div>
  );
}
