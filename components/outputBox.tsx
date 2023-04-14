interface Iprops {
  output: string[];
  loading: boolean;
}

export default function OutputBox(props: Iprops) {
  return (
    <div
      className={`w-full mx-[10%] h-[300px] mt-10 flex flex-wrap ${
        props.loading ? "bg-white/20" : "bg-white"
      }`}
    >
      {props.loading ? (
        <div className="w-full h-full justify-center content-center">
          "Loading..."
        </div>
      ) : (
        props.output.map((data) => {
          return <span className="inline-flex text-black">{data}</span>;
        })
      )}
    </div>
  );
}
