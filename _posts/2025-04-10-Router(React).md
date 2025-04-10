---
layout: single
toc: true
tag: [react, Router]
categories: React
sidebar:
  nav: "counts"
---

React는 컴포넌트 기반 UI 라이브러리로, 주로 단일 페이지 애플리케이션(SPA)을 구축할 때 많이 사용됩니다. SPA에서는 페이지 간 이동을 위해 전통적인 브라우저 리로딩 없이 클라이언트 측에서 URL만 변경하면서 다른 화면(컴포넌트)을 렌더링해야 합니다. **React Router**는 이러한 내비게이션을 구현할 수 있도록 도와주는 라이브러리입니다.

이번 포스팅에서는 React Router의 기본 개념부터 시작해 설치 방법, 주요 컴포넌트와 Hook, 그리고 간단한 예제까지 차근차근 설명하겠습니다.

---

## 1. React Router란?

**React Router**는 React 애플리케이션 내에서 URL 기반의 라우팅을 구현할 수 있게 해주는 라이브러리입니다. 이를 사용하면 사용자의 URL 경로에 따라 서로 다른 컴포넌트를 렌더링할 수 있으며, 전체 페이지를 새로 고침하지 않고도 자연스러운 페이지 전환을 경험할 수 있습니다.

### React Router의 특징

- **클라이언트 사이드 라우팅:** 페이지 전환 시 브라우저 전체를 새로 고침하지 않고 필요한 컴포넌트만 바꾸어 성능과 사용자 경험을 높입니다.
- **동적 라우팅:** URL 매개변수와 쿼리스트링을 사용하여 동적으로 경로를 설정할 수 있습니다.
- **중첩 라우팅:** 복잡한 애플리케이션에서 중첩된 경로를 사용해 계층적인 UI 구조를 쉽게 표현할 수 있습니다.

> **참고:** React Router는 버전 6 기준으로 API와 사용법에 몇 가지 변화가 있습니다. 이 포스팅에서는 최신 버전인 v6를 기준으로 설명합니다.

---

## 2. React Router 설치하기

React 프로젝트에서 React Router를 사용하려면 먼저 패키지를 설치해야 합니다. 터미널에서 아래 명령어를 실행하세요.

```bash
npm install react-router-dom
```

또는 Yarn을 사용하는 경우:

```bash
yarn add react-router-dom
```

---

## 3. 주요 컴포넌트와 Hook

React Router v6의 사용법은 이전 버전과 다소 차이가 있지만, 기본적인 개념은 비슷합니다. 여기서는 주요 컴포넌트와 Hook들을 소개하겠습니다.

### 3.1. `<BrowserRouter>`

- **역할:**
  애플리케이션의 최상위에서 라우팅 컨텍스트를 제공하는 컴포넌트입니다. URL 히스토리(API)를 관리하며, 내부에 정의된 모든 라우트가 이 컨텍스트를 상속받습니다.

- **사용법:**
  보통 `index.js`나 최상위 컴포넌트(App.js)에서 사용합니다.

  ```jsx
  import React from "react";
  import ReactDOM from "react-dom";
  import { BrowserRouter } from "react-router-dom";
  import App from "./App";

  ReactDOM.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
    document.getElementById("root")
  );
  ```

### 3.2. `<Routes>`와 `<Route>`

- **역할:**
  `<Routes>` 컴포넌트는 여러 `<Route>` 컴포넌트를 감싸며, 현재 URL과 일치하는 경로에 해당하는 컴포넌트를 찾아 렌더링합니다.

- **`<Route>`의 주요 속성:**

  - `path`: URL 경로를 지정합니다.
  - `element`: 해당 경로에서 렌더링할 React 요소(컴포넌트)를 지정합니다.

- **사용법 예시:**

  ```jsx
  import React from "react";
  import { Routes, Route } from "react-router-dom";
  import Home from "./pages/Home";
  import About from "./pages/About";
  import NotFound from "./pages/NotFound";

  function App() {
    return (
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          {/* 위 경로와 일치하는 것이 없을 경우 NotFound 컴포넌트 렌더링 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    );
  }

  export default App;
  ```

### 3.3. `<Link>` 컴포넌트

- **역할:**
  `<Link>`는 일반 HTML의 `<a>` 태그와 비슷하지만, 페이지 전체를 새로 고치지 않고 클라이언트 사이드 내비게이션을 수행합니다.

- **사용법 예시:**

  ```jsx
  import React from "react";
  import { Link } from "react-router-dom";

  function Navigation() {
    return (
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
      </nav>
    );
  }

  export default Navigation;
  ```

### 3.4. 유용한 Hook들

React Router v6에서는 몇 가지 Hook을 제공하여 라우팅과 관련된 정보를 쉽게 사용할 수 있습니다.

- **`useParams`:**
  URL 경로에 포함된 매개변수를 읽어올 때 사용합니다.

  ```jsx
  import React from "react";
  import { useParams } from "react-router-dom";

  function User() {
    const { userId } = useParams(); // 예: 경로에 /user/:userId가 있을 때
    return <div>사용자 ID: {userId}</div>;
  }

  export default User;
  ```

- **`useNavigate`:**
  프로그래밍 방식으로 다른 경로로 이동할 때 사용하는 Hook입니다.

  ```jsx
  import React from "react";
  import { useNavigate } from "react-router-dom";

  function Login() {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
      e.preventDefault();
      // 로그인 로직을 수행한 후, 대시보드로 이동
      navigate("/dashboard");
    };

    return (
      <form onSubmit={handleSubmit}>
        <button type="submit">로그인</button>
      </form>
    );
  }

  export default Login;
  ```

---

## 4. React Router 예제 만들기

여기에서는 간단한 예제를 통해 기본적인 라우팅을 구현해 보겠습니다.

### 4.1. 프로젝트 구조

```
src/
├── App.js
├── index.js
└── pages/
    ├── Home.js
    ├── About.js
    └── NotFound.js
```

### 4.2. 각 컴포넌트 작성

**Home.js**

```jsx
import React from "react";

function Home() {
  return (
    <div>
      <h1>홈페이지</h1>
      <p>환영합니다!</p>
    </div>
  );
}

export default Home;
```

**About.js**

```jsx
import React from "react";

function About() {
  return (
    <div>
      <h1>About 페이지</h1>
      <p>이 프로젝트는 React Router를 이용하여 라우팅을 구현한 예제입니다.</p>
    </div>
  );
}

export default About;
```

**NotFound.js**

```jsx
import React from "react";

function NotFound() {
  return (
    <div>
      <h1>404 - 페이지를 찾을 수 없습니다</h1>
    </div>
  );
}

export default NotFound;
```

**App.js**

```jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Navigation from "./Navigation";

function App() {
  return (
    <div>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        {/* 모든 경로에 매칭되지 않는 경우 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
```

**Navigation.js**

```jsx
import React from "react";
import { Link } from "react-router-dom";

function Navigation() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
```

**index.js**

```jsx
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
```

### 4.3. 동작 설명

- **BrowserRouter**는 최상위에서 라우팅 컨텍스트를 제공하며,
- **Navigation** 컴포넌트를 통해 `<Link>`를 사용하여 다른 경로로 이동할 수 있습니다.
- **Routes**와 **Route**는 현재 URL에 따라 렌더링할 컴포넌트를 결정합니다.
- 존재하지 않는 경로는 `path="*"`를 통해 **NotFound** 컴포넌트를 렌더링해 404 페이지를 표시합니다.

---

## 5. 고급 사용법

### 5.1. 중첩(Nested) 라우팅

React Router에서는 중첩 라우트를 쉽게 구현할 수 있습니다. 예를 들어, 대시보드와 그 하위 메뉴를 구성할 때, 상위 라우트 안에 하위 `<Routes>`를 넣어 관리할 수 있습니다.

```jsx
// Dashboard.js 예시
import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Overview from "./Overview";
import Settings from "./Settings";

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <nav>
        <ul>
          <li>
            <Link to="overview">Overview</Link>
          </li>
          <li>
            <Link to="settings">Settings</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="overview" element={<Overview />} />
        <Route path="settings" element={<Settings />} />
      </Routes>
    </div>
  );
}

export default Dashboard;
```

위 예제에서 Dashboard는 자신의 하위 경로(예: `/dashboard/overview`, `/dashboard/settings`)를 가지고 있으며, 중첩된 `<Routes>`를 통해 해당 경로에 맞는 컴포넌트를 렌더링합니다.

### 5.2. URL 매개변수와 쿼리스트링

- **`useParams`**: URL에 동적 매개변수가 있을 경우 해당 값을 받아올 수 있습니다.
- **`useLocation`**: 현재 URL의 정보(예: 쿼리스트링)를 얻을 수 있습니다.

예를 들어, `/user/:userId` 경로를 사용한다면:

```jsx
import React from "react";
import { useParams } from "react-router-dom";

function UserProfile() {
  const { userId } = useParams();
  return <div>현재 사용자 ID: {userId}</div>;
}

export default UserProfile;
```

---

## 6. 정리

이번 포스팅에서는 React Router를 통해 SPA 내비게이션을 구현하는 기본적인 방법을 살펴보았습니다. 주요 내용은 다음과 같습니다:

- **React Router란?**
  클라이언트 사이드 라우팅을 구현하여 페이지 전체를 새로 고치지 않고도 URL에 따라 다른 컴포넌트를 렌더링하는 라이브러리입니다.
- **설치와 기본 설정:**
  `react-router-dom`을 설치한 후, 최상위 컴포넌트에서 `<BrowserRouter>`로 감싸주는 방식입니다.
- **주요 컴포넌트:**
  `<Routes>`와 `<Route>`, `<Link>`를 통해 URL에 따른 컴포넌트 매칭과 내비게이션을 구현합니다.
- **Hook 사용:**
  `useParams`, `useNavigate` 등을 통해 동적 라우팅과 프로그래밍 방식 내비게이션이 가능합니다.
- **고급 사용법:**
  중첩 라우팅과 URL 매개변수, 쿼리스트링 처리 방법 등을 통해 더 복잡한 애플리케이션 내비게이션도 구현할 수 있습니다.

React Router는 SPA 개발에 매우 강력한 도구입니다. 이번 포스팅의 예제와 설명을 통해 기본 사용법을 익히고, 더 복잡한 라우팅 시나리오에 도전해보세요. 다음 포스팅에서는 React Router를 이용한 실제 프로젝트에서의 내비게이션 최적화와 에러 핸들링 등에 대해 더 다뤄볼 수 있습니다.

---

이로써 React Router에 관한 초보자 가이드를 마칩니다. 여러분의 프로젝트에 성공적으로 적용하여 보다 다이나믹한 사용자 경험을 제공해보세요!
