import React from "react";
import {
  CssBaseline,
  Grid,
  Typography,
  withStyles,
  Tabs,
  Tab,
  Divider,
} from "@material-ui/core";

import { connect } from "react-redux";
import * as actions from "../actions";
import { SignUp, Login } from "./Form/pages";

import styles from "./registration.style";

class Registration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: 0,
    };
  }

  onTabChange = (event, newValue) => {
    this.setState({
      tab: newValue,
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <Grid item xs={false} md={4} lg={7} className={classes.image}>
          {this.renderHeroText()}
        </Grid>
        <Grid item xs={12} md={8} lg={5}>
          {this.renderFormArea()}
        </Grid>
      </Grid>
    );
  }
  renderHeroText = () => {
    const { classes } = this.props;
    return (
      <div>
        <Typography variant="h2" className={classes.title}>
          TandaPay
        </Typography>
      

        
      </div>
    );
  };
  renderFormArea = () => {
    const { classes } = this.props;
    return (
      <div className={classes.area}>
        <Tabs value={this.state.tab} onChange={this.onTabChange}>
          <Tab label="Sign Up" />
          <Tab label="Log In" />
        </Tabs>
        {this.state.tab === 0 && <SignUp />}
        {this.state.tab === 1 && <Login />}
       
  
      </div>
    );
  };
}

export default connect(
  null,
  actions
)(withStyles(styles, { withTheme: true })(Registration));
