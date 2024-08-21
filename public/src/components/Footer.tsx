import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  styled,
} from "@material-ui/core";

const FooterContent = styled(Typography)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
});

const AppBarContainer = styled(AppBar)({
  marginTop: "100px",
});

const Footer: React.FC = () => {
  return (
    <AppBarContainer position="static" color="transparent">
      <Container maxWidth="xs">
        <Toolbar>
          <FooterContent variant="body1" color="inherit">
            <div>© {new Date().getFullYear()}</div>
            <div>andydarr.dev</div>
            <a href="https://github.com/c4ndybar/my-site" target="blank">
              repo
            </a>
          </FooterContent>
        </Toolbar>
      </Container>
    </AppBarContainer>
  );
};

export default Footer;
