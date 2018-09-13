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

const UserOverview = ({users}) => (
	<div className="users box">
		<span className="users--header box--header">Registered users</span>
		<div className="users--list">
			{ users.map((user) => <User key={user.uuid} user={user}/>) }
		</div>
	</div>
)

const User = ({user}) => (
	<div className="users--entry">
		<img className="users--entry--picture entry--picture" src={user.pictureUrl} />
		<span className="users--entry--name" title={user.email}>{ user.fullName }</span>
	</div>
)

const IdeaOverview = ({ideas, createIdea}) => (
	<div className="ideas box">
		<span className="ideas--header box--header">Ideas</span>

		<IdeaCreator createIdea={createIdea} />

		{ ideas ? (
		<div className="ideas--list">
			{ ideas.map((idea) => <Idea key={idea.uuid} idea={idea} />) }
		</div>
			) : <span className="ideas--empty-list">No ideas submitted yet</span>}
	</div>
)

class IdeaCreator extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			title: '',
			description: ''
		};
	}

	handleChange(event) {
		this.setState({
			...this.state,
			[event.target.name]: event.target.value
		});
	}

	createIdea() {
		const title = this.state.title.trim();
		const description = this.state.description.trim();
		if (!title || !description) return;

		this.props.createIdea(title, description);
		this.setState({
			title: '',
			description: ''
		})
	}

	render() {
		return (
			<div className="ideas--creator">
				<input className="ideas--creator--title" type="text" name="title" placeholder="Title" value={this.state.title} onChange={this.handleChange.bind(this)}/>
				<textarea className="ideas--creator--description" name="description" placeholder="Description" value={this.state.description} onChange={this.handleChange.bind(this)}/>
				<button className="ideas--creator--create" onClick={() => this.createIdea()}>Create</button>
			</div>
		)
	}
}

const Idea = ({idea}) => (
	<div className="ideas--entry">
		<img className="ideas--entry--picture entry--picture" src={idea.createdBy.pictureUrl} title={idea.createdBy.fullName} />
		<span className="ideas--entry--title">{ idea.title }</span>
		<span className="ideas--entry--description">{ idea.description }</span>
	</div>
)

class Index extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			auth: {},
			users: [],
			ideas: []
		};
	}

	componentDidMount() {
		fetch('/auth', {credentials: 'same-origin'})
			.then(response => response.json())
			.then(data => this.setState({ ...this.state, auth: data }));

		fetch('/user', {credentials: 'same-origin'})
			.then(response => response.json())
			.then(data => this.setState({ ...this.state, users: data }));

		fetch('/idea', {credentials: 'same-origin'})
			.then(response => response.json())
			.then(data => this.setState({ ...this.state, ideas: data }));
	}

	createIdea(title, description) {
		fetch('/idea', {
			method: 'post',
			headers: {
				'content-type': 'application/json'
			},
			credentials: 'same-origin',
			body: JSON.stringify({ title, description })
		}).then(response => response.json())
			.then(data => this.setState({ ...this.state, ideas: [...this.state.ideas, data] }));
	}

	render() {
		const { auth, users, ideas } = this.state;
		return (
			<div>
				<Header email={auth.email} pictureUrl={auth.pictureUrl} />

				<IdeaOverview ideas={ideas} createIdea={(title, description) => this.createIdea(title, description)}/>

				<UserOverview users={users} />
			</div>
		)
	}
}

ReactDOM.render(<Index/>, document.getElementById("main"));