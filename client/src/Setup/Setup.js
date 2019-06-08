import React from "react";
import { CssBaseline, Grid, withStyles } from "@material-ui/core";
import { connect } from "react-redux";
import * as actions from "../actions";
import { WalletPage, RolePage } from "./pages";
import styles from "./setup.style";

class Setup extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			role: "",
			accessCode: "",
			walletProvider: "",
			ethAddress: "",
			page: 0
		};
	}
	onRoleSubmit = (role, accessCode) => {
		this.setState({
			role,
			accessCode,
			page: 1
		});
	};

	onWalletSubmit = (walletProvider, ethAddress) => {
		this.setState({
			walletProvider,
			ethAddress
		});
		const { role, accessCode } = this.state;
		//call action creator
		this.props.completeAccount({
			role,
			accessCode,
			walletProvider,
			ethAddress
		});
	};
	handlePreviuos = () => {
		const { page } = this.state;
		if (page === 0) {
			//cancel user
			console.log("Cancel the user");
			this.props.cancelAccount();
		} else {
			this.setState({
				page: 0
			});
		}
	};
	render() {
		const { classes } = this.props;
		const { page } = this.state;
		return (
			<Grid container component="main" className={classes.root}>
				<CssBaseline />
				{page === 0 && (
					<RolePage
						onPageSubmit={this.onRoleSubmit}
						previousPage={this.handlePreviuos}
					/>
				)}
				{page === 1 && (
					<WalletPage
						onPageSubmit={this.onWalletSubmit}
						previousPage={this.handlePreviuos}
					/>
				)}
			</Grid>
		);
	}
}
export default connect(
	null,
	actions
)(withStyles(styles, { withTheme: true })(Setup));
