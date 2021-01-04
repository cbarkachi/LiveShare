import styled from "styled-components";
import { Button as BootstrapButton } from "react-bootstrap";

export const Button = styled(BootstrapButton)`
  background-color: rgb(0, 132, 137);
  border-color: rgb(0, 132, 137);
  &&&:hover,
  &&&:focus,
  &&&:active,
  &&&:disabled {
    background-color: rgb(23, 112, 115);
    border-color: rgb(0, 132, 137);
  }
`;
