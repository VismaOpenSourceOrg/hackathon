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


class UserOverview extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			users: [],
		};
	}

	componentDidMount() {
		fetch('/user', {credentials: 'same-origin'})
			.then(response => response.json())
			.then(data => this.setState({ users: data }));
	}

	render() {
		const { users } = this.state;
		return (
			<div className="users">
				<span className="users--header">Registered users</span>
				<div className="users--list">
				{ users.map((user) => <User key={user.uuid} user={user}/>) }
				</div>
			</div>
		)
	}
}

const User = ({user}) => (
	<div className="users--entry">
		<img className="users--entry--picture" src={user.pictureUrl} />
		<span className="users--entry--name" title={user.email}>{ user.fullName }</span>
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
		fetch('/auth', {credentials: 'same-origin'})
			.then(response => response.json())
			.then(data => this.setState({ auth: data }));
	}

	render() {
		const { auth } = this.state;
		return (
			<div>
				<Header email={auth.email} pictureUrl={auth.pictureUrl}/>

				<UserOverview/>
			</div>
		)
	}

}

ReactDOM.render(<Index/>, document.getElementById("main"));