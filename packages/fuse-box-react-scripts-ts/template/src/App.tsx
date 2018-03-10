

import * as React from 'react';
import * as logo from './logo.svg';

import styled, {keyframes} from 'styled-components';

var Center = styled.div`
text-align: center;
`

var Header = styled.div`
background-color: #282c34;
min-height: 100vh;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
font-size: calc(10px + 2vmin);
color: white;
`

var Link = styled.a`
color: #61dafb;
text-decoration: none;
`

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;


var Logo = styled.img`
animation: ${rotate360} infinite 20s linear;
height: 40vmin;`

class App extends React.Component {
  render() {
    return (
      <Center>
        <Header>
          <Logo src={logo} alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <Link
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </Link>
          <Link
            href="https://www.typescriptlang.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn TypeScript
          </Link>
        </Header>
      </Center>
    );
  }
}

export default App;
