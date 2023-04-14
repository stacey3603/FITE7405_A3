import { useState } from "react";
export enum ControlType {
  True = "True",
  False = "False",
}
interface Iprops {
  onTrueButtonClick: () => void;
  onFalseButtonClick: () => void;
  selectedType: ControlType | undefined;
}
export default function ControlSelector(props: Iprops) {
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
          <p className="w-full">Please chose your control type</p>
        </button>
        <div
          className={`w-[80px] text-center flex-wrap absolute top-[50px] left-0 text-black bg-white ${
            showSelector ? "flex" : "hidden"
          }`}
        >
          <span
            className="w-full border border-black"
            onClick={() => {
              props.onTrueButtonClick();
              setShowSelector(false);
            }}
          >
            True
          </span>
          <span
            className="w-full border border-black"
            onClick={() => {
              props.onFalseButtonClick();
              setShowSelector(false);
            }}
          >
            False
          </span>
        </div>
      </div>
      <div className="w-full h-6 mt-40 flex text-center text-gray relative">
        Control Type: {props.selectedType ?? "--"}
      </div>
    </div>
  );
}
