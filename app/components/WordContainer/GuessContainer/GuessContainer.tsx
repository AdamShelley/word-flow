import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";

import GuessCard from "./GuessCard";
import SubmitSuccess from "../../CompletedDay/SubmitSuccess";

type GuessProps = {
  letterClicked: string;
  setLetterClick: (letter: string) => void;
  word: string;
  setWord: (letter: any) => void;
  error: string;
  submittedScore: boolean;
};

const fetchLetters = async () => {
  const response = await axios.get("/api/highscore/getLetters");
  return response.data;
};

export default function GuessContainer({
  letterClicked,
  setLetterClick,
  word,
  setWord,
  error,
  submittedScore,
}: GuessProps) {
  if (submittedScore) return <SubmitSuccess />;

  const { data } = useQuery({
    queryFn: fetchLetters,
    queryKey: ["get-letters"],
  });

  useEffect(() => {
    if (word.length < 6) {
      setWord((prev: string) => prev + letterClicked);
      setLetterClick("");
    }
  }, [letterClicked]);

  return (
    <>
      {!submittedScore && (
        <div className="flex flex-col">
          <div className="flex justify-center align-center py-2 mt-5">
            {data && (
              <div className="flex flex-col">
                <div className="mt-3 bg-slate-800 text-center">
                  {error && <p className="text-red-400">{error}</p>}
                </div>
                <div className="flex align-center justify-center">
                  <GuessCard
                    letters={data?.letter}
                    word={word}
                    setWord={setWord}
                  />
                </div>
              </div>
            )}
            {/* Skeleton */}
            {!data && (
              <div className="flex flex-col">
                <div className="mt-3 bg-slate-800 text-center">
                  {error && <p className="text-red-400">{error}</p>}
                </div>
                <div className="flex align-center justify-center">
                  <div className="flex flex-col align-center justify-center text-center">
                    <div className="h-20">
                      <input
                        maxLength={6}
                        className="border-b-2 border-slate-500 bg-transparent text-slate-100 text-5xl w-9/12 h-full text-center"
                        type="text"
                        autoComplete="off"
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
