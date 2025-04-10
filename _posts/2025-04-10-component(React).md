---
layout: single
toc: true
tag: [react, component, jsx]
categories: React
---

# React?

리액트는 UI (사용자 인터페이스) 를 구축하기 위한 자바스크립트 라이브러리로
컴포넌트를 기반으로 설계되어 효율적이며, 재사용 가능한 코드가 작성가능하다.

## 기본 형태

기본적으로 index.html 이라는 파일에서 다른 컴포넌트들을 렌더링하며
그 안에서 계층적으로 구성을 하여 UI 를 만들어낸다.

### import

리액트를 사용함에 있어서 꼭 알아야 하는 것 중 하나가 import 이다.

하나하나의 컴포넌트를 가져오겠다는 것으로

```jsx
import React from "react";
import ReactDOM from "react-dom";

ReactDOM.render(<App />, document.getElementById("root"));
```

기본적으로 이렇게 작성이 시작된다.

### export

하나의 컴포넌트를 만들면 그 컴포넌트를 다른 곳에서도 쓸 수 있게 만들기 위해서

그 컴포넌트를 밖으로 빼내야 한다. 그래서 가장 마지막줄에

```jsx
import React from "react";

function MyComponent() {
  return <div>Hello, React!</div>;
}

export default MyComponent;
```

이런 형식으로 마무리한다.

## jsx

새로워 보이지만 별 특별한 건 아니다. 자바스크립트 안에서 html 같으 구문을 사용할 수 있도록 해주는 문법 확장이라고 보면 된다.

- HTML과 유사한 문법을 사용하지만, 실제로는 자바스크립트 객체로 변환된다.
- 자바스크립트 표현식 객체는 { } 안에 들어가야 한다.
- 태그는 꼭 하나의 부모태그로 감싸야한다.

```jsx
const element = (
  <div>
    <h1>Hello, React!</h1>
    <p>{`2 + 2 = ${2 + 2}`}</p>
  </div>
);
```

## 컴포넌트

컴포넌트는 재사용 가능한 UI 단위라고 생각하면 된다.

주요 특징은, 독립적인 상태와 속성을 관리 할 수 있으며 함수형과 클래스형으로 나뉘지만

대부분 함수형을 쓰고 있다.

```jsx
function Greeting(props) {
  return <h1>Hello, {props.name}!</h1>;
}

//화살표 함수로 작성
const Greeting = ({ name }) => <h1>Hello, {name}!</h1>;
```

리액트를 다루는데 있어서 특별한 것은 없지만 얼마나 컴포넌트를 잘 나누는지, 얼마나 코드를 간결하고 가독성 있게 작성하는지, js 문법을 얼마나 유용하게 쓰는지가 속도의 차이를 만들어내지 않을까 생각한다.
