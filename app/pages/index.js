import { useState, useEffect } from "react";
import Head from "next/head";
import { AnimatePresence, motion } from "framer-motion";

export default function Home() {
  // State + Data
  const [input, setInput] = useState("");
  const [inputIndex, setInputIndex] = useState(0);
  const [shown, setShown] = useState(false);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Effects
  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [inputIndex, shown, input, handleKeyPress, months.filter((month) => {
    return month
      .toLowerCase()
      .startsWith(input.toLowerCase());
  })]);

  useEffect(() => {
    document.addEventListener("click", handlePageClick);
    return () => {
      document.removeEventListener("click", handlePageClick);
    };
  }, [shown]);

  // Event Listeners
  function handleKeyPress(e) {
    switch (e.key) {
      case "Escape":
        setShown(false);
        document.getElementById("input").value = "";
        if (e.target !== null) {
          e.target.blur();
          setInput("");
          setInputIndex(0);
        }
        break;
      case "Tab":
      case "ArrowDown":
        if (shown) {
          e.preventDefault();
          
          if (inputIndex == months.length - 1) {
            setInputIndex(0);
          } else {
            setInputIndex((old) => old + 1);
          }
        }
        break;
      case "ArrowUp":
        if (shown) {
          e.preventDefault();
          if (inputIndex == 0) {
            setInputIndex(months.length - 1);
          } else {
            setInputIndex((old) => old - 1);
          }
        }
        break;
      case "Backspace":
        if (shown) {
          setInputIndex(0);
        }
        break;
      case "Enter":
        if (shown) {
          setInput(months[inputIndex]);
          setShown(false);
          e.target.blur();
        }
        break;
    }
  }

  function handlePageClick(e) {
    if (shown && e.target.id !== "options") {
      setShown(false);
    }
  }

  // Functions
  function toggleOptions() {
    if (!shown && document.activeElement.id === "input") {
      setShown(true);
    } else if (document.activeElement.id !== "input") {
      setShown(!shown);
    }
  }

  function getJSON() {
    return { active: inputIndex, data: input, optionsVisible: shown };
  }

  return (
    <div id="app" className="overflow-clip">
      <div className="flex flex-col items-center w-full h-screen text-slate-400 bg-slate-900">
        <div className="p-6 mt-16 rounded-md w-[300px] overflow-x-auto bg-slate-800 shadow-md ">
          <pre className="font-mono text-lg font-bold text-slate-200">
            <code>{JSON.stringify(getJSON(), null, "  ")}</code>
          </pre>
        </div>
        <div className="relative mt-6 ">
          {/* Select */}
          <div
            id="select"
            onClick={() => {
              toggleOptions();
              setInput("");
            }}
          >
            <div className="flex items-center p-4 rounded-md shadow-md cursor-pointer bg-slate-800">
              <input
                id="input"
                className="text-lg font-semibold bg-transparent outline-none placeholder:text-slate-500"
                type="search"
                placeholder="Month"
                value={input}
                autoComplete="off"
                onChange={() => {
                  setInput(document.getElementById("input").value);
                  if (input.length != 0) {
                    setInputIndex(
                      months.indexOf(
                        months.filter((month) => {
                          return month
                            .toLowerCase()
                            .startsWith(input.toLowerCase());
                        })[0]
                      )
                    );
                  }
                }}
                onClick={toggleOptions}
              />
              <button
                onClick={() => {
                  toggleOptions();
                  setInput("");
                }}
                tabIndex={-1}
              >
                <svg
                  className="transition-all duration-300 cursor-pointer hover:text-slate-200"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
            </div>
          </div>
          {/* Options */}
          <AnimatePresence>
            {shown && (
              <motion.div
                id="options"
                className="absolute w-full mt-4 text-lg"
                key="options"
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="p-2 px-2 font-semibold rounded-md shadow-md bg-slate-800 text-slate-400">
                  <ul className="">
                    {months
                      .filter((month) => {
                        return month
                          .toLowerCase()
                          .startsWith(input.toLowerCase());
                      })
                      .map((month) => {
                        return (
                          <li
                            key={self.crypto.randomUUID()}
                            className={`px-4 py-2 duration-300 rounded-md cursor-pointer hover:bg-slate-900 translate-all ${
                              months[inputIndex] === month &&
                              "bg-slate-900 shadow-lg"
                            }`}
                            onClick={() => {
                              setInput(month);
                              setInputIndex(months.indexOf(month));
                              toggleOptions();
                            }}
                          >
                            {month}
                          </li>
                        );
                      })}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
    </div>
  );
}
