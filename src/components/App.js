import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import Finish from "./Finish";
import Timer from "./Timer";

const initialState = {
  questions: [],
  status: "loading",
  index: 0,
  dice: Math.trunc(Math.random() * 16),
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null,
  questionNumber: [Math.trunc(Math.random() * 16)],
};
const SEC_PER_QUESTION = 30;
function reducer(state, action) {
  switch (action.type) {
    case "dataRecived":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };
    case "dataFailed":
      return {
        ...state,
        status: "error",
      };
    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SEC_PER_QUESTION,
        questionNumber: [...state.questionNumber, state.dice],
      };

    case "newAnswer":
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case "nextQuestion":
      // return { ...state, index: state.index + 1, answer: null };
      return {
        ...state,
        index: state.index + 1,
        dice: Math.trunc(Math.random() * 16),
        answer: null,
        questionNumber: [...state.questionNumber, state.dice],
      };
    case "finish":
      return {
        ...state,
        status: "finished",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    case "restart":
      return {
        ...initialState,
        questions: state.questions,
        status: "ready",
        highscore: state.highscore,
      };
    // return {
    //   ...state,

    //   status: "ready",
    //   index: 0,
    //   answer: null,
    //   points: 0,
    //   secondsRemaining: 10,
    // };
    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };
    default:
      throw new Error("action unknown");
  }
}

export default function App() {
  const [
    {
      questions,
      status,
      index,

      answer,
      points,
      highscore,
      secondsRemaining,
      questionNumber,
    },
    dispatch,
  ] = useReducer(reducer, initialState);
  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce((acc, cur) => acc + cur.points, 0);

  useEffect(function () {
    fetch("http://localhost:8000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataRecived", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);
  console.log(questionNumber);

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
            <Progress
              index={index}
              numQuestions={numQuestions}
              points={points}
              maxPossiblePoints={maxPossiblePoints}
              answer={answer}
            />
            <Question
              question={questions[questionNumber[index]]}
              dispatch={dispatch}
              answer={answer}
            />

            <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
            <NextButton
              dispatch={dispatch}
              answer={answer}
              totalQuestions={questions.length}
              numQuestions={numQuestions}
              index={index}
              questionNumber={questionNumber}
            />
          </>
        )}
        {status === "finished" && (
          <Finish
            points={points}
            maxPossiblePoints={maxPossiblePoints}
            highscore={highscore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}
