import React from "react";
import { Button, withStyles, Grid } from "@material-ui/core";
import clsx from "clsx";
import styles from "./button.style";
class ButtonGroup extends React.Component {
	render() {
		const { handleNext, handlePrevious, classes } = this.props;
		return (
			<Grid container className={classes.buttonGroup}>
				<Grid item xs={6} className={classes.cancelButton}>
					<Button
						variant="contained"
						className={clsx(classes.button, classes.cancel)}
						onClick={handlePrevious}
					>
						Cancel
					</Button>
				</Grid>
				<Grid item xs={6} className={classes.nextButton}>
					<Button
						variant="contained"
						color="primary"
						className={clsx(classes.button, classes.next)}
						onClick={handleNext}
					>
						Next
					</Button>
				</Grid>
			</Grid>
		);
	}
}

export default withStyles(styles, { withTheme: true })(ButtonGroup);
