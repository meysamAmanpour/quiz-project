function NextButton({ dispatch, answer, index, numQuestions, questionNumber }) {
  const questionsLength = questionNumber.length;

  if (answer === null) return;

  if (index < numQuestions - 1)
    return (
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "nextQuestion" })}
      >
        Next
      </button>
    );
  if (questionsLength === numQuestions || index === numQuestions - 1)
    // if (index === numQuestions - 1)
    return (
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "finish" })}
      >
        finish
      </button>
    );
}

export default NextButton;
