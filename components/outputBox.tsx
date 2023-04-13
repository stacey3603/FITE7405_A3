interface Iprops {
  output: string[];
}

export default function OutputBox(props: Iprops) {
  return (
    <div className="w-full mx-[10%] h-[300px] mt-10 flex flex-wrap bg-white">
      {props.output.map((data) => {
        return <span className="inline-flex text-black">{data}</span>;
      })}
    </div>
  );
}
