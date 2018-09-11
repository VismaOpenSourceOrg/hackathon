import React from "react";
import ReactDOM from "react-dom";

const Header = ({email, pictureUrl}) => (
	<div className="header">
		<span className="header--title">Hackathon</span>
		<div className="header--auth">
			<span className="header--auth--email">{ email }</span>
			<img className="header--auth--picture" src={pictureUrl}/>
		</div>
	</div>
)

class Index extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			auth: {},
		};
	}

	componentDidMount() {
		fetch('/auth')
			.then(response => response.json())
			.then(data => this.setState({ auth: data }));
	}

	render() {
		const { auth } = this.state;
		return (
			<div>
				<Header email={auth.email} pictureUrl={auth.pictureUrl}/>
			</div>
		)
	}

}

ReactDOM.render(<Index/>, document.getElementById("main"));