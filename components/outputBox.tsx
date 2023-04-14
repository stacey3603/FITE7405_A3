interface Iprops {
  output: string[];
  loading: boolean;
}

export default function OutputBox(props: Iprops) {
  return (
    <div
      className={`w-full mx-[10%] h-[300px] mt-10 flex flex-wrap justify-center content-center ${
        props.loading ? "bg-white/20" : "bg-white"
      }`}
    >
      {props.loading
        ? "Loading..."
        : props.output.map((data) => {
            return <span className="inline-flex text-black">{data}</span>;
          })}
    </div>
  );
}
