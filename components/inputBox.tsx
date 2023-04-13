interface Iprops {
  dataDescription: string;
  inputValue: string;
  onInputChange: any;
}

export default function InputBox(props: Iprops) {
  return (
    <div className="flex flex-wrap">
      <p className="w-full">Please put your option data here:</p>
      <p className="w-full">Input format: {props.dataDescription}</p>
      <p>
        Please seperated with &quot; ; &quot; if you want to calculate multiple
        options
      </p>
      <input
        type="text"
        className="w-full bg-white h-[200px] mt-2 text-black justify-start content-start text-start"
        value={props.inputValue}
        onChange={props.onInputChange}
      ></input>
    </div>
  );
}
