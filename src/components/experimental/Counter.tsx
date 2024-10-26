import { useState } from "react";

export const Counter = () => {
  const [count, setCount] = useState(0);

  //   const handleIncrement = () => {
  //     setCount(count + 1);
  //   }; Refactor code to use arrow function

  return (
    <div>
      <p>Contador: {count}</p>
      <button onClick={() => setCount(count + 1)}>Incrementar</button>
    </div>
  );
};
