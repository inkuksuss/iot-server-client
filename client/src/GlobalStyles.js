import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

const globalStyles = createGlobalStyle`
    ${reset};
    background-color: #FFFFFF;
    a {
        text-decoration: none;
        color: inherit;
    }
    * {
        box-sizing: border-box;
    }
    body {
        font-family: "B612 Mono", monospace;
        margin-right: 180px;
    }
    /* h1,
    h2,
    h3,
    h4 {
        font-family: "DM Serif Display", serif;
    } */

.slide-enter {
    opacity: 0;
  transform: translateX(100%);
}

.slide-enter.slide-enter-active {
    opacity: 1;
    transform: translateX(0%);
    transition: all 1s ease-in;
}

.slide-exit {
    opacity: 1;
    transform: translate(50%, -100%) rotateZ(0);
}

.slide-exit.slide-exit-active {
    opacity: 0;
    transform: translate(-100%, -100%) rotateZ(-45deg);
    transition: all 1s ease-in;
}

div.transition-group {
  position: relative;
}

section.route-section {
  width: 100%;
}

/* .fade-enter {
  opacity: 0.01;
  transition: translateX(100px);
}

.fade-enter.fade-enter-active {
  opacity: 1;
  transition: translateX(100px);
}

.fade-exit {
  opacity: 1;
  transition: translateX(100px);
}

.fade-exit.fade-exit-active {
  opacity: 0.01;
  transition: opacity 300ms ease-in;
}

div.transition-group {
  position: relative;
}

section.route-section {
  width: 100%;
} */
`;



export default globalStyles;