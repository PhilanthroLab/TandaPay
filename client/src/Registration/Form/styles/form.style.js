import { red } from "@material-ui/core/colors";

const styles = (theme) => ({
	form: {
		margin: theme.spacing(5),
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main
	},
	social:{
		
		width: "auto"
	},
	
	formFix: {
		width: "100%", // Fix IE 11 issue.
		marginTop: theme.spacing(1)
	},

	error:{
		color: "#721c24",
		backgroundColor: "#f8d7da",
		borderColor: "#f5c6cb",
		position: "relative",
   		padding: ".75rem 1.25rem",
        marginBottom: "1rem",
        border:" 1px solid transparent",
		borderRadius:" .25rem",
		display: "block",
		width: "100%",
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
		width: "100%",
		backgroundColor: theme.palette.secondary.light,
		color: "white",
		[theme.breakpoints.up("md")]: {
			width: "auto",
			padding: theme.spacing(1.5, 6, 1.5, 6),
			float: "right"
		},
		"&:hover": {
			backgroundColor: theme.palette.secondary.main
		}
	},
	formControl: {
		margin: theme.spacing(3)
	},
	group: {
		margin: theme.spacing(1, 0)
	}
});

export default styles;
