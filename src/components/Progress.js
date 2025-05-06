function Progress({ index, numQuestions, points, maxPossiblePoints, answer }) {
  return (
    <div className="progress">
      <progress max={numQuestions} value={index + Number(answer !== null)} />
      <p>
        Question <strong>{index + 1}</strong>/{numQuestions}
      </p>
      <p>
        <strong>{points}</strong>/{maxPossiblePoints} points
      </p>
    </div>
  );
}

export default Progress;
