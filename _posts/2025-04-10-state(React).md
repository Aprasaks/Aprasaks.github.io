---
layout: single
toc: true
tag: [react, state, useState]
categories: React
---

이번 포스팅에서는 React에서 **state**가 무엇이고, 왜 중요한지, 그리고 이를 어떻게 효과적으로 사용하는지에 대해 자세히 알아보겠습니다.

------

## State의 기본 개념

**state**는 컴포넌트 내부에서 관리되는 데이터로, 컴포넌트의 동적인 특성을 결정합니다. state의 주요 포인트는 다음과 같습니다.

- **내부 데이터 저장소:**
   컴포넌트 내부에서 상태(state)는 사용자 입력, 네트워크 요청 결과, 타이머 등 다양한 변화에 따라 업데이트되는 데이터를 담습니다.
- **UI와의 연동:**
   state가 변경되면 React는 해당 컴포넌트를 다시 렌더링하여 최신 상태를 UI에 반영합니다. 이를 통해 사용자 인터랙션에 따른 동적인 UI 구성이 가능해집니다.
- **불변성:**
   state를 직접 변경하지 않고, 업데이트 함수(setState 또는 useState의 set함수)를 통해 변경해야 합니다. 이를 통해 React는 변경 사항을 감지하고 효율적으로 업데이트할 수 있습니다.

------

## 2. 클래스형 컴포넌트와 함수형 컴포넌트에서의 state

React의 state는 이전에는 클래스형 컴포넌트에서 주로 다루어졌지만, 최근에는 **Hooks**를 통해 함수형 컴포넌트에서도 간편하게 사용할 수 있습니다.

### 2.1. 클래스형 컴포넌트 예시

```jsx
import React, { Component } from "react";

class Counter extends Component {
  constructor(props) {
    super(props);
    // 초기 state 설정
    this.state = {
      count: 0,
    };
  }

  increment = () => {
    // setState를 사용하여 state 업데이트
    this.setState({ count: this.state.count + 1 });
  };

  render() {
    return (
      <div>
        <p>현재 카운트: {this.state.count}</p>
        <button onClick={this.increment}>증가</button>
      </div>
    );
  }
}

export default Counter;
```

**설명:**

- 클래스형 컴포넌트에서는 constructor를 통해 초기 state를 설정합니다.
- state를 업데이트할 때는 `this.setState()`를 사용하여 변경해야 합니다.
- setState가 호출되면 컴포넌트는 다시 렌더링 되어 최신 상태를 반영합니다.

### 2.2. 함수형 컴포넌트와 Hooks 사용 예시

React 16.8부터 도입된 **Hooks**를 사용하면, 함수형 컴포넌트에서도 간편하게 state를 관리할 수 있습니다.

```jsx
import React, { useState } from "react";

function Counter() {
  // useState를 사용해 count state를 초기값 0으로 설정
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>현재 카운트: {count}</p>
      {/* setCount를 호출하여 state 업데이트 */}
      <button onClick={() => setCount(count + 1)}>증가</button>
    </div>
  );
}

export default Counter;
```

**설명:**

- `useState(0)`를 호출하여 count라는 state 변수와 이를 업데이트할 setCount 함수를 생성합니다.
- 버튼 클릭 시 setCount를 통해 count 값을 업데이트하면 컴포넌트가 재렌더링됩니다.

------

## 3. State 업데이트 방식과 주의사항

### 3.1. 상태의 불변성 유지

- **불변성을 유지하는 이유:**
   직접 변경하는 것이 아니라, 새로운 값으로 업데이트함으로써 React는 이전과 현재의 state를 비교하고 변화한 부분만 재렌더링할 수 있습니다.

- **올바른 업데이트 방식:**
   배열이나 객체를 업데이트할 경우, 기존 값을 수정하지 않고 새로운 객체나 배열을 만들어 업데이트하는 것이 중요합니다.

  ```jsx
  // 잘못된 예시 (직접 수정):
  this.state.items.push(newItem); // 클래스형 컴포넌트의 경우
  
  // 올바른 예시:
  this.setState({ items: [...this.state.items, newItem] });
  ```

### 3.2. 비동기성

- **setState와 useState:**
   React의 state 업데이트는 비동기적으로 처리됩니다. 따라서 바로 업데이트된 값을 사용하고자 할 때는 주의가 필요합니다.

- **이전 state에 의존한 업데이트:**
   이전 state를 기반으로 새 값을 계산해야 하는 경우 함수형 업데이트를 활용하는 것이 좋습니다.

  ```jsx
  // 함수형 업데이트 예시 (클래스형 컴포넌트):
  this.setState((prevState) => ({ count: prevState.count + 1 }));
  
  // 함수형 컴포넌트의 useState 예시:
  setCount((prevCount) => prevCount + 1);
  ```

------

## 4. State를 활용한 다양한 예시

### 4.1. 입력폼 처리

사용자 입력을 받고 이를 state에 저장하여 양방향 데이터 바인딩을 구현할 수 있습니다.

```jsx
import React, { useState } from "react";

function InputForm() {
  const [value, setValue] = useState("");

  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <p>입력한 값: {value}</p>
    </div>
  );
}

export default InputForm;
```

### 4.2. 조건부 렌더링

state를 이용해 UI 요소의 표시 여부를 제어할 수 있습니다.

```jsx
import React, { useState } from "react";

function ToggleMessage() {
  const [show, setShow] = useState(false);

  return (
    <div>
      <button onClick={() => setShow(!show)}>
        {show ? "숨기기" : "보이기"}
      </button>
      {show && <p>안녕하세요! 반가워요!</p>}
    </div>
  );
}

export default ToggleMessage;
```

**설명:**

- 버튼을 클릭할 때마다 show state가 토글되며, 조건부 렌더링을 통해 메시지의 표시 여부가 변경됩니다.

------

## 5. 정리

- **State의 역할:**
   state는 컴포넌트 내부 데이터를 저장하고, 이 데이터에 변화가 발생할 때 UI를 갱신하는 핵심 메커니즘입니다.
- **업데이트 방식:**
   불변성을 유지하며, 비동기 특성을 고려해 업데이트해야 합니다. 함수형 업데이트 패턴을 활용하여 이전 state 값에 기반한 새로운 값을 안전하게 계산할 수 있습니다.
- **Hooks의 도입:**
   함수형 컴포넌트에서도 `useState`를 통해 손쉽게 state를 관리할 수 있으며, 기존 클래스형 컴포넌트보다 간결하고 직관적인 코드 작성을 도와줍니다.

state를 잘 이해하고 활용한다면, React 컴포넌트의 동적인 부분을 효과적으로 관리할 수 있습니다. 다음 포스팅에서는 state를 다루면서 발생할 수 있는 고급 패턴 혹은 side-effects를 관리하는 방법(useEffect 등)에 대해 다뤄보겠습니다.
