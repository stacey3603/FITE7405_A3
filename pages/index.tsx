import type { NextPage } from "next";
import { useRouter } from "next/router";

interface Page {
  path: string;
  name: string;
}

const pages: Page[] = [
  {
    path: "European_Option",
    name: "European Option",
  },

  {
    path: "Implied_Volatility",
    name: "Implied Volatility",
  },
  {
    path: "American_Option",
    name: "American Option",
  },
  {
    path: "Geometric_Asian",
    name: "Geometric Asian Option",
  },

  {
    path: "Geometric_Basket",
    name: "Geometric Basket Option",
  },
  {
    path: "Arithmetic_Asian",
    name: "Arithmetic Asian Option",
  },
  {
    path: "Arithmetic_Basket",
    name: "Arithmetic Basket Option",
  },
  {
    path: "Kiko_Put",
    name: "KIKO Put Option",
  },
];

const Home: NextPage = () => {
  const router = useRouter();

  return (
    <>
      <div className="w-screen h-screen flex flex-wrap justify-center content-start">
        <ul className="w-full px-[10%] grid grid-cols-2 gap-4">
          {pages.map((page) => (
            <li className="inline-flex justify-center my-20 bg-transparent">
              <button
                className="w-[300px] px-4 py-6 text-center bg-green-100 text-black rounded-[8px]"
                onClick={() => router.push(page.path)}
              >
                {page.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Home;
